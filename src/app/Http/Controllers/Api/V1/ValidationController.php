<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiV1Controller;
use App\Http\Requests\V1\ValidateLibraryItemNameRequest;
use App\Rules\UniqueLibraryNameRule;
use App\Utils\Enum\RegexPatternsEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

/**
 * Validation Controller - performs various independent asynchronous validations
 */
class ValidationController extends ApiV1Controller
{
    #[OA\Post(
        path: '/api/v1/validations/email',
        operationId: 'validate-email',
        description: '',
        summary: "Validate user's e-mail address during signup and/or changing address through its profile",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email'),
            ]),
        ),
        tags: ['validations'],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function validateUserEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:128', 'unique:users,email'],
        ]);

        return new JsonResponse(status: 204);
    }

    #[OA\Post(
        path: '/api/v1/validations/libraries',
        operationId: 'validate-library-name',
        description: '',
        summary: 'Validate uniqueness for Library name when a new Library is created',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'title', type: 'string'),
            ]),
        ),
        tags: ['validations'],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function validateLibraryName(Request $request): JsonResponse
    {
        $libraryTitlePattern = RegexPatternsEnum::LIBRARY_TITLE;

        $request->validate([
            'title' => ['required', 'string', 'max:255', "regex:$libraryTitlePattern", new UniqueLibraryNameRule()],
        ]);

        return new JsonResponse(status: 204);
    }

    #[OA\Post(
        path: '/api/v1/validations/libraries/{id}/items',
        operationId: 'validate-library-item-name',
        description: '',
        summary: "Validate uniqueness for Item title when the Item is created or updated\n\n." .
        'When updating an existing Item, please provide its ID with `item` property in the request body to skip ' .
        "the self-checking of its existing title for uniqueness. \nWhen creating a new Item, the property `item` " .
        'should be either omitted or set to `null`. ',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'title', type: 'string', example: 'The Matrix'),
                new OA\Property(property: 'item', type: 'integer', example: 1, nullable: true),
            ]),
        ),
        tags: ['validations'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    public function validateLibraryItemName(ValidateLibraryItemNameRequest $request): JsonResponse
    {
        $request->hasValidSignature(); // stub

        return new JsonResponse(status: 204);
    }
}
