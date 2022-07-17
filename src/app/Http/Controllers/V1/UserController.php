<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\SignupRequest;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

use function MongoDB\BSON\toJSON;

/**
 * User controller - manage user/identity actions
 */
class UserController extends ApiV1Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/user/signup",
     *     summary="Sign Up",
     *     description="Sign up a new user",
     *     tags={"user"},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *                 @OA\Property(property="email", type="string", example="admin@example.com"),
     *                 @OA\Property(property="username", type="string", example="John Doe"),
     *                 @OA\Property(property="password", type="string", example="PasSw0rd"),
     *                 @OA\Property(property="passwordRepeat", type="string", example="PasSw0rd"),
     *                 @OA\Property(property="locale", type="string", example="en"),
     *                 @OA\Property(property="theme", type="string", example="dark"),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="default", description="Work in Progress")
     * )
     */
    public function signup(SignupRequest $request): JsonResponse
    {
        return response()->json([]);
    }

    public function signin()
    {

    }
}
