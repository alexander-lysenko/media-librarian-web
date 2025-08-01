<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiV1Controller;
use App\Http\Requests\V1\PosterUploadRequest;
use App\Services\ImageProcessingService;
use App\Utils\Enum\PictureFormatEnum;
use App\Utils\TmpFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

/**
 * PosterController - Uses a temporary storage to upload posters
 */
class PosterController extends ApiV1Controller
{
    private string $tmpPrefix = self::R2_STORAGE_POSTER_TMP_PREFIX;

    #[OA\Get(
        path: '/api/v1/posters',
        operationId: 'posters-find',
        description: 'Find a poster by ID',
        summary: 'Find Poster By ID',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['posters'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'query',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: [
                    new OA\MediaType(
                        mediaType: 'image/webp',
                        schema: new OA\Schema(type: 'string', format: 'binary'),
                    ),
                    new OA\MediaType(
                        mediaType: 'application/json',
                        schema: new OA\Schema(properties: [
                            new OA\Property(property: 'data', type: 'string', format: 'base64'),
                        ]),
                    ),
                ],
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_404_REF, response: 404),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function find(Request $request): JsonResponse|BinaryFileResponse
    {
        $request->validate(['id' => ['required', 'uuid']]);
        $uuid = $request->input(key: 'id');

        $imgContents = Storage::disk(name: 'r2')->get(path: "$this->tmpPrefix/$uuid.webp");

        if (empty($imgContents)) {
            throw new NotFoundHttpException(message: 'Poster not found');
        }

        if ($request->wantsJson()) {
            return new JsonResponse(['data' => base64_encode(string: $imgContents)]);
        }

        $tmpFilePath = (new TmpFile())->getFilename();
        file_put_contents(filename: $tmpFilePath, data: $imgContents);

        return (new BinaryFileResponse(file: $tmpFilePath))->deleteFileAfterSend();
    }

    #[OA\Post(
        path: '/api/v1/posters',
        operationId: 'posters-upload',
        description: 'A Poster is uploaded into the temporary storage and its UUID is returned by the endpoint. ' .
        'You may provide the UUID to a Library Item on create or update it, then the poster will be attached to that ' .
        "Item and the file will be moved into the permanent storage. \n\n" .
        'Every temporary poster not attached to any Library Item will be disposed after 24 hours.',
        summary: 'Upload Poster',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: [
                new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(properties: [
                    new OA\Property(property: 'poster', type: 'file', format: 'image/*'),
                ])),
                new OA\MediaType(mediaType: 'application/json', schema: new OA\Schema(properties: [
                    new OA\Property(property: 'poster', type: 'string', format: 'base64'),
                ])),
            ],
        ),
        tags: ['posters'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'id', type: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000'),
                ]),
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_413_REF, response: 413),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function upload(PosterUploadRequest $request, ImageProcessingService $imageProcessingService): JsonResponse
    {
        $uuid = Str::uuid();
        $uploadedFile = $request->file(key: 'poster');

        try {
            $imgContents = $imageProcessingService->convert(
                contents: $uploadedFile->get(),
                format: PictureFormatEnum::WEBP,
            );
            file_put_contents(filename: $uploadedFile->getRealPath(), data: $imgContents);
            $storedFilePath = Storage::disk(name: 'r2')->putFileAs(
                path: $this->tmpPrefix,
                file: $uploadedFile,
                name: "$uuid.webp"
            );
            if (empty($storedFilePath)) {
                throw new FileException('Rejected to upload the file.');
            }
        } catch (Throwable $exception) {
            Log::error($exception);

            return new JsonResponse(data: ['message' => "Failed to upload poster: {$exception->getMessage()}"], status: 500);
        }

        return new JsonResponse(data: ['id' => $uuid], status: 201);
    }
}
