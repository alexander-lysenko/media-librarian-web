<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\EmailVerifyRequest;
use App\Http\Requests\V1\SignupRequest;
use App\Models\User;
use App\Utils\Enum\UserStatusEnum;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use OpenApi\Annotations as OA;

/**
 * User controller - manage user/identity actions
 * @TODO: See https://github.com/laravel/breeze
 */
class UserController extends ApiV1Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/user/signup",
     *     summary="Register a new user",
     *     description="Sign up a new user",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *                 @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="password", type="string", example="PasSw0rd"),
     *                 @OA\Property(property="passwordRepeat", type="string", example="PasSw0rd"),
     *                 @OA\Property(property="locale", type="string", example="en"),
     *                 @OA\Property(property="theme", type="string", example="dark"),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="201",
     *         description="Created",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string",
     *                 property="message",
     *                 example="Your account has been created. You have to verify your e-mail to activate the account"
     *             ),
     *             @OA\Property(type="object", property="user",
     *                 @OA\Property(type="integer", property="id", example=1),
     *                 @OA\Property(type="string", property="name", example="John Doe"),
     *                 @OA\Property(type="string", property="email", example="john.doe@example.com"),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="422",
     *         description="Unprocessable Entity",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="object", property="errors",
     *                 @OA\Property(type="array", property="email",
     *                     @OA\Items(type="string", example="Email is required"),
     *                 ),
     *             ),
     *         ),
     *     ),
     * ),
     *
     * @param SignupRequest $request
     * @return JsonResponse
     */
    public function signup(SignupRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Event::dispatch(new Registered($user));

        return Response::json([
            'message' => 'Your account has been created. You have to verify your e-mail to activate the account',
            'user' => $user,
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/login",
     *     summary="Login",
     *     description="Sign In / Authenticate a user",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *                 @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *                 @OA\Property(property="password", type="string", example="PasSw0rd"),
     *                 @OA\Property(property="rememberMe", type="boolean", example=true),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="302",
     *         description="Moved Temporarily",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="redirectTo", example="/app"),
     *             @OA\Property(type="string", property="message", example="Successfully logged in"),
     *             @OA\Property(type="string", property="token", example="token"),
     *             @OA\Property(type="string", property="redirectTo", example="/login"),
     *         ),
     *     ),
     *
     *     @OA\Response(response="default", description="Unauthorized",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Incorrect email and/or password")
     *         ),
     *     ),
     * )
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $token = $request->user()->createToken('apiToken')->plainTextToken;

            return Response::json([
                'message' => 'Successfully logged in',
                'token' => explode("|", $token)[1],
                'redirectTo' => '/app',
            ], 302);
        }

        return Response::json([
            'message' => 'Incorrect email and/or password',
        ], 401);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/user/email-verify",
     *     summary="Activate an account by verifying their email using a verification key",
     *     description="It is required to provide the verification key sent via e-mail after the successful signup",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\Parameter(required=true, name="email", in="query",
     *         @OA\Schema(type="string", example="john.doe@example.com")
     *     ),
     *     @OA\Parameter(required=true, name="verificationKey", in="query",
     *         @OA\Schema(type="string", example="57c131437cc7885444087a775884d453")
     *     ),
     *
     *     @OA\Response(response="200", description="Success",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string",
     *                 property="message",
     *                 example="Email has been verified. The user's account is active now"
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="410", description="Gone",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string",
     *                 property="message",
     *                 example="The user's email is already verified or the verification key is expired"
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="422", description="Unprocessable Entity",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Account with this email was not found"),
     *             @OA\Property(type="object",
     *                 property="errors",
     *                 @OA\Property(type="array", property="email",
     *                     @OA\Items(type="string", example="Account with this email was not found")
     *                 ),
     *             ),
     *         ),
     *     ),
     * )
     *
     * @param EmailVerifyRequest $request
     * @return JsonResponse
     */
    public function emailVerify(EmailVerifyRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->email)->get()->first();

        if ($user->hasVerifiedEmail()) {
            return Response::json([
                'message' => "The user's email is already verified",
            ], 410);
        }

        if (true /*match the verification key with email*/) {
            $user->forceFill([
                'status' => UserStatusEnum::STATUS_ACTIVE,
                'email_verified_at' => $user->freshTimestamp(),
            ])->save();
            event(new Verified($user));
        }

        return Response::json([
            'message' => "Email has been verified. The user's account is active now",
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/password-reset",
     *     summary="Request a token for reset password on an account",
     *     description="The token will be sent over e-mail to the specified e-mail address",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="200", description="Work in Progress",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Work in Progress")
     *         ),
     *     ),
     * )
     *
     * WIP
     * @param Request $request
     * @return JsonResponse
     */
    public function requestPasswordReset(Request $request): JsonResponse
    {
        return Response::json([
            'message' => 'success',
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/user/password-reset",
     *     summary="Perform the password reset using the token received over e-mail and a new desired password",
     *     description="The token expires 60 minutes after it was issued. The password should be confirmed",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\Response(response="200", description="Work in Progress",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Work in Progress")
     *         ),
     *     ),
     * )
     *
     * WIP
     * @param Request $request
     * @return JsonResponse
     */
    public function performPasswordReset(Request $request): JsonResponse
    {
        return Response::json([
            'message' => 'success',
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/user",
     *     summary="Get User Info",
     *     description="Request the full profile of the authenticated user",
     *     tags={"user.authenticated"},
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
     *     path="/api/v1/user/logout",
     *     summary="Logout",
     *     description="Sign out / Deauthenticate a user",
     *     tags={"user.authenticated"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Response(response="302", description="Found",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Successfully logged out"),
     *             @OA\Property(type="string", property="redirectTo", example="/login"),
     *         ),
     *     ),
     *
     *     @OA\Response(response="default", description="Work in Progress",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="Work in Progress")
     *         ),
     *     ),
     * )
     *
     * WIP
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
