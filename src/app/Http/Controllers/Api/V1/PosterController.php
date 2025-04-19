<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiV1Controller;
use App\Utils\FileHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * PosterController - Uses a temporary storage to upload posters
 */
class PosterController extends ApiV1Controller
{
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
                        mediaType: 'image/jpeg',
                        schema: new OA\Schema(type: 'string', format: 'binary'),
                    ),
                    new OA\MediaType(
                        mediaType: 'application/json',
                        schema: new OA\Schema(type: 'string', format: 'base64'),
                    ),
                ],
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_404_REF, response: 404),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function find(Request $request): BinaryFileResponse
    {
        $request->validate(['id' => ['required', 'uuid']]);
        $key = implode(':', ['posters', $request->input('id')]);

        if (Cache::has($key)) {
            return new BinaryFileResponse(Cache::get($key));
        }
        throw new NotFoundHttpException('Poster not found');
    }

    #[OA\Post(
        path: '/api/v1/posters',
        operationId: 'posters-upload',
        description: 'A Poster is uploaded into the temporary storage and its UUID is returned by the endpoint. ' .
        'You may provide the UUID to a Library Item on create or update it, then the poster will be attached to that ' .
        "Item and the file will be moved into the permanent storage. \n\n" .
        'Any temporary poster not attached to a Library Item will be disposed after 24 hours.',
        summary: 'Upload Poster',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: [
                new OA\MediaType(
                    mediaType: 'application/json',
                    schema: new OA\Schema(properties: [
                        new OA\Property(property: 'poster', type: 'string', format: 'base64'),
                    ])
                ),
                new OA\MediaType(
                    mediaType: 'multipart/form-data',
                    schema: new OA\Schema(properties: [
                        new OA\Property(property: 'poster', type: 'file', format: 'image/jpeg'),
                    ])
                ),
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
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function upload(Request $request): JsonResponse
    {
        $uuid = Str::uuid();

        $requestContentType = $request->getContentTypeFormat();
        $requestData = [];

        if ($requestContentType === 'json') {
            $request->validate(['poster' => ['required', 'string']]);
            $requestData['poster'] = FileHelper::fromBase64($request->input('poster'));
        } else {
            $request->validate(['poster' => ['required', 'file']]);
            $requestData['poster'] = $request->file('poster');
        }

        $validator = Validator::make($requestData, [
            'poster' => ['image', 'mimes:jpeg,png,webp,bitmap', 'max:2048'],
        ]);

        try {
            $validator->validate();
        } catch (ValidationException $e) {
            /** @noinspection PhpUnhandledExceptionInspection */
            throw $e;
        }

        // Save the file to the Memcached or Redis
        Cache::put(
            key: implode(':', ['posters', $uuid]),
            value: file_get_contents($requestData['poster']),
            ttl: 86_400,
        );

        return new JsonResponse(['id' => $uuid], 201);
    }
}
