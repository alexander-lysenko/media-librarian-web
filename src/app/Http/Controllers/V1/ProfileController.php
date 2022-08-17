<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use OpenApi\Annotations as OA;

/**
 * Profile controller - manage account/profile actions
 */
class ProfileController extends ApiV1Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/profile",
     *     summary="Get User Info",
     *     description="Request the full profile of the authenticated user",
     *     tags={"profile"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Response(response="200", description="OK",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="object", property="user",
     *                 @OA\Property(type="integer", property="id", example=1),
     *                 @OA\Property(type="string", property="name", example="John Doe"),
     *                 @OA\Property(type="string", property="email", example="john.doe@example.com"),
     *                 @OA\Property(type="datetime", property="email_verified_at", example="2000-01-01 00:00:01"),
     *                 @OA\Property(type="string", property="status", example="ACTIVE"),
     *                 @OA\Property(type="datetime", property="deleted_at", example="2000-01-01 00:00:01"),
     *                 @OA\Property(type="datetime", property="created_at", example="2000-01-01 00:00:01"),
     *                 @OA\Property(type="datetime", property="updated_at", example="2000-01-01 00:00:01"),
     *             ),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     * )
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function profile(Request $request): JsonResponse
    {
        return Response::json([
            'user' => $request->user(),
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/profile/logout",
     *     summary="Logout",
     *     description="Sign out / Deauthenticate a user",
     *     tags={"profile"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Response(response="default", description="Found",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Successfully logged out"),
     *             @OA\Property(type="string", property="redirectTo", example="/login"),
     *         ),
     *     ),
     *
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     * )
     *
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
