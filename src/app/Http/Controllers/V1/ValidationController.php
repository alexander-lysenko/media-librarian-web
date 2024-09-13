<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\ValidateLibraryItemNameRequest;
use App\Models\SqliteLibraryMeta;
use App\Rules\UniqueLibraryNameRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'validation', description: 'Auxiliary validation endpoints for front-end forms')]
/**
 *
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
            // rules
            'email' => ['required', 'string', 'email', 'max:128', 'unique:users,email'],
        ]);

        return new JsonResponse(status: 204);
    }

    #[OA\Post(
        path: '/api/v1/validation/libraries',
        operationId: 'validate-library-name',
        description: '',
        summary: 'Validate uniqueness for Library name (within an user\'s Libraries)',
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
        $request->validate([
            // rules
            'title' => ['required',
                'string',
                'max:255',
                'regex:/^([\p{L}\p{N}]+[ ]?)+$/mu',
                new UniqueLibraryNameRule()],
        ]);

        return new JsonResponse(status: 204);
    }

    #[OA\Post(
        path: '/api/v1/validation/libraries/{id}/items',
        operationId: 'validate-library-item-name',
        description: '',
        summary: 'Validate uniqueness for Library Item name (within a Library)',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['validation'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(
                name: 'item',
                description: 'Include ID of an existing Item if the validation should ignore it (in case of updating)',
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
