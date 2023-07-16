<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'profile', description: 'Profile (Authenticated User)')]
#[OA\Schema(
    schema: 'Profile',
    properties: [
        new OA\Property(property: 'user', properties: [
            new OA\Property(property: 'id', type: 'integer', example: 1),
            new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
            new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
            new OA\Property(property: 'created_at', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'updated_at', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'email_verified_at', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'deleted_at', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'status', type: 'string', example: 'ACTIVE'),
            new OA\Property(property: 'avatar', type: 'string', example: 'data:image/svg+xml;base64,PD9...PC9zdmc+'),
        ]),
    ]
)]

/**
 * Profile controller - manage account/profile actions
 */
class ProfileController extends ApiV1Controller
{
    #[OA\Get(
        path: '/api/v1/profile',
        operationId: 'profile-index',
        description: 'Request the full profile of the authenticated User',
        summary: 'Get User Info',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['profile'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(ref: self::SCHEMA_PROFILE_REF),
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
        ]
    )]
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return Response::json([
            'user' => $request->user(),
        ]);
    }

    /**
     *
     */
    public function update(): void
    {
    }

    /**
     *
     */
    public function changePassword(): void
    {
    }

    #[OA\Post(
        path: '/api/v1/profile/logout',
        operationId: 'profile-logout',
        description: 'Sign out / De-authenticate a User',
        summary: 'Logout',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['profile'],
        responses: [
            new OA\Response(response: 'default',
                description: '302 Found',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Successfully logged out'),
                    new OA\Property(property: 'redirectTo', type: 'string', example: '/login'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
        ]
    )]
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        // Revoke the token that was used to authenticate the current request...
        $request->user()->currentAccessToken()->delete();

        return Response::json([
            'message' => 'Successfully logged out',
            'redirectTo' => '/login',
        ], 302);
    }
}
