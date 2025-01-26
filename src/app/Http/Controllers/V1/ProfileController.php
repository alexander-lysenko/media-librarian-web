<?php

namespace App\Http\Controllers\V1;

use App\Models\SqliteLibraryMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
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
            new OA\Property(property: 'avatar', type: 'string', example: 'data:image/svg+xml;base64,PD9...PC9zdmc+'),
        ]),
        new OA\Property(property: 'stats', properties: [
            new OA\Property(property: 'status', type: 'string', example: 'ACTIVE'),
            new OA\Property(property: 'createdAt', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'updatedAt', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'emailVerifiedAt', type: 'datetime', example: '2000-01-01 00:00:01'),
            new OA\Property(property: 'librariesTotal', type: 'integer', example: 1),
            new OA\Property(property: 'itemsTotal', type: 'integer', example: 1),
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
        description: 'The response contains data about profile of the authenticated User',
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
        $user = $request->user();
        $libraries = SqliteLibraryMeta::query()->pluck('id');
        $itemsTotal = 0;

        foreach ($libraries as $libraryId) {
            $itemsTotal += SqliteLibraryMeta::getLibraryTableQuery(libraryId: $libraryId)->count();
        }

        return Response::json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ],
            'stats' => [
                'status' => $user->status,
                'createdAt' => Date::parse($user->created_at)->format('Y-m-d H:i:s'),
                'updatedAt' => Date::parse($user->updated_at)->format('Y-m-d H:i:s'),
                'emailVerifiedAt' => $user->email_verified_at
                    ? Date::parse($user->email_verified_at)->format('Y-m-d H:i:s')
                    : null,
                'librariesTotal' => $libraries->count(),
                'itemsTotal' => $itemsTotal,
            ],
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
        description: 'Sign out / De-authenticate a User / Invalidate credentials',
        summary: 'Logout [DEV]',
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
