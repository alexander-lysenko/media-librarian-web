<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiV1Controller;
use App\Http\Requests\V1\PasswordChangeRequest;
use App\Http\Requests\V1\ProfileRequest;
use App\Models\PersonalSetting;
use App\Models\SqliteLibraryMeta;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use OpenApi\Attributes as OA;
use Throwable;

#[OA\Schema(
    schema: 'Profile',
    properties: [
        new OA\Property(property: 'user', properties: [
            new OA\Property(property: 'id', type: 'integer', example: 1),
            new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
            new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
            new OA\Property(property: 'locale', type: 'string', example: 'en'),
            new OA\Property(property: 'theme', type: 'string', example: 'light'),
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
 *
 * TODO: Create User Repository
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
    public function index(Request $request): JsonResponse
    {
        return $this->getProfileInfo($request->user());
    }

    #[OA\Patch(
        path: '/api/v1/profile',
        operationId: 'profile-update',
        description: "Details of profile can be updated using this endpoint. \n\n" .
        "Every property of the request is optional so you may skip a property if you don't need to update it. \n" .
        "An avatar must be provided in base64 format. To remove avatar, set the `avatar` property to `null`. \n\n" .
        'For security reasons, e-mail address won\'t be updated until user confirms it via confirmation email. ' .
        'Instead, it triggers sending the confirmation email. In the meantime, current e-mail address will be used ' .
        'for authentication and status of the address remains confirmed.',
        summary: 'Update Profile Info',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                new OA\Property(property: 'locale', type: 'string', enum: ['en', 'ru']),
                new OA\Property(property: 'theme', type: 'string', enum: ['dark', 'light']),
                new OA\Property(property: 'avatar', type: 'string', example: 'data:image/jpeg;base64,PD9...PC9zdmc+'),
            ])
        ),
        tags: ['profile'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(ref: self::SCHEMA_PROFILE_REF),
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function update(ProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $userSettings = $user->settings ?: new PersonalSetting(['user_id' => $user->id]);

        $connection = $user->getConnection();

        if ($request->theme) {
            $userSettings->theme = $request->theme;
        }
        if ($request->locale) {
            $userSettings->locale = $request->locale;
        }
        // avatar may be null, so we need to check its presence
        if ($request->has('avatar')) {
            $userSettings->avatar = $request->avatar;
        }
        if ($request->name) {
            $user->name = $request->name;
        }


        // TODO: implement sending of verification email
        // if ($request->email) {
        //     $userToUpdate['email'] = $request->email;
        // }

        try {
            $connection->transaction(static function () use ($user, $userSettings) {
                $user->settings()->save($userSettings);
                $user->save();
            });
        } catch (Throwable $throwable) {
            Log::error($throwable);
        }

        return $this->getProfileInfo($user);
    }

    #[OA\Put(
        path: '/api/v1/profile/password',
        operationId: 'profile-change-password',
        description: "Changes password of the authenticated User. Current password is required. \n\n" .
        'WARNING! This action invalidates all active sessions (personal access tokens) except current one.',
        summary: 'Change User\'s Password',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'password', type: 'string', example: 'PasSw0rd'),
                new OA\Property(property: 'newPassword', type: 'string', example: 'NewPassword1234'),
                new OA\Property(property: 'repeatPassword', type: 'string', example: 'NewPassword1234'),
            ])
        ),
        tags: ['profile'],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function changePassword(PasswordChangeRequest $request): JsonResponse
    {
        /** TODO: Protect this endpoint with captcha */
        // Changes password (assuming that the current password was successfully validated)
        $request->user()
            ->forceFill(['password' => Hash::make($request->validated('newPassword'))])
            ->save();

        // Revoke all personal access tokens excluding current
        $currentAccessToken = $request->user()->currentAccessToken();
        $request->user()->tokens()->whereNot('id', $currentAccessToken->id)->delete();

        return new JsonResponse(null, 204);
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

    /**
     * A template method to get Profile info in consistent structure.
     *
     * @param User $user
     * @return JsonResponse
     */
    private function getProfileInfo(User $user): JsonResponse
    {
        $libraries = SqliteLibraryMeta::query()->pluck('id');

        $cacheKey = implode(':', ['totalItems', 'user', $user->id]);
        $itemsTotal = Cache::remember($cacheKey, 360, static function () use ($libraries) {
            $total = 0;
            foreach ($libraries as $libraryId) {
                $total += SqliteLibraryMeta::getLibraryTableQuery(libraryId: $libraryId)->count();
            }

            return $total;
        });

        return Response::json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'locale' => $user->settings->locale ?: 'en',
                'theme' => $user->settings->theme ?: 'light',
                'avatar' => $user->settings->avatar ?: null,
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
}
