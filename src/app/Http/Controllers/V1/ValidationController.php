<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\ValidateLibraryItemNameRequest;
use App\Rules\UniqueLibraryNameRule;
use App\Utils\Enum\RegexPatternsEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'validation', description: 'Auxiliary validation endpoints for front-end forms')]
/**
 * Validation Controller - performs various independent asynchronous validations
 */
class ValidationController extends ApiV1Controller
{
    #[OA\Post(
        path: '/api/v1/validation/email',
        operationId: 'validate-email',
        description: '',
        summary: 'Validate user\'s e-mail address during signup',
        tags: ['validation'],
        parameters: [
            new OA\Parameter(name: 'email', in: 'query', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function validateUserEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:128', 'unique:users,email'],
        ]);

        return new JsonResponse(status: 204);
    }

    #[OA\Post(
        path: '/api/v1/validation/libraries',
        operationId: 'validate-library-name',
        description: '',
        summary: 'Validate uniqueness for Library name when a new Library is created',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['validation'],
        parameters: [
            new OA\Parameter(name: 'title', in: 'query', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function validateLibraryName(Request $request): JsonResponse
    {
        $libraryTitlePattern = RegexPatternsEnum::LIBRARY_TITLE->value;

        $request->validate([
            'title' => ['required', 'string', 'max:255', "regex:$libraryTitlePattern", new UniqueLibraryNameRule()],
        ]);

        return new JsonResponse(status: 204);
    }

    #[OA\Post(
        path: '/api/v1/validation/libraries/{id}/items',
        operationId: 'validate-library-item-name',
        description: '',
        summary: 'Validate uniqueness for Item name when the Item is created or updated',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['validation'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(
                name: 'item',
                description: 'Include ID of the Item that is updated to skip its self-checking for uniqueness',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer')
            ),
            new OA\Parameter(name: 'name', in: 'query', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param ValidateLibraryItemNameRequest $request
     * @return JsonResponse
     */
    public function validateLibraryItemName(ValidateLibraryItemNameRequest $request): JsonResponse
    {
        $request->hasValidSignature(); // stub

        return new JsonResponse(status: 204);
    }
}
