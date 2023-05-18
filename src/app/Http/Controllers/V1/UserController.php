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
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'guest', description: 'Guest (Unauthenticated User)')]
/**
 * User controller - manage user/identity actions
 * @TODO: See https://github.com/laravel/breeze
 */
class UserController extends ApiV1Controller
{
    #[OA\Post(
        path: '/api/v1/user/signup',
        operationid: 'user-signup',
        description: 'Sign up a new User',
        summary: 'Register a new User',
        // requestBody: new OA\RequestBody(
        //     required: true,
        //     content: new OA\JsonContent(
        //         properties: [
        //
        //         ]
        //     )
        // ),
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'password', type: 'string', example: 'PasSw0rd'),
                    new OA\Property(property: 'passwordRepeat', type: 'string', example: 'PasSw0rd'),
                    new OA\Property(property: 'locale', type: 'string', example: 'en'),
                    new OA\Property(property: 'theme', type: 'string', example: 'dark'),
                ]
            )
        ),
        tags: ['guest'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
            //     @OA\JsonContent(type:"object",
            //         @OA\Property(property:"message",
            //             type:"string",
            //             example:"Your account has been created. You have to verify your e-mail to activate the account"
            //         ),
            //         @OA\Property(type:"object", property:"user",
            //             @OA\Property(property:"id", type:"integer", example:1),
            //             @OA\Property(property:"name", type:"string", example:"John Doe"),
            //             @OA\Property(property:"email", type:"string", example:"john.doe@example.com"),
            //         ),
            //     ),
            ),

            // @OA\Response(response:"422",
            //     description:"Unprocessable Entity",
            //     @OA\JsonContent(type:"object",
            //         @OA\Property(property:"errors", type:"object",
            //             @OA\Property(property:"email", type:"array",
            //                 @OA\Items(type:"string", example:"Email is required"),
            //             ),
            //         ),
            //     ),
            // ),
        ]
    )]
    /**
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

    #[OA\Post(
        path: '/api/v1/user/login',
        operationid: 'profile-login',
        description: 'Obtain an API (Bearer) token to execute the rest of requests as an authenticated User',
        summary: 'Login (obtain an API token)',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'PasSw0rd'),
                    new OA\Property(property: 'rememberMe', type: 'boolean', example: true),
                ]
            )
        ),
        tags: ['guest'],
        responses: [
            new OA\Response(
                response: 302,
                description: 'Moved Temporarily',
            //     @OA\JsonContent(type:"object",
            //         @OA\Property(property:"redirectTo", type:"string", example:"/app"),
            //         @OA\Property(property:"message", type:"string", example:"Successfully logged in"),
            //         @OA\Property(property:"token", type:"string", example:"token"),
            //     ),
            ),
            //
            // @OA\Response(response:"default", description:"Unauthorized",
            //     @OA\JsonContent(type:"object",
            //         @OA\Property(property:"message", type:"string", example:"Incorrect email and/or password")
            //     ),
            // ),
        ]
    )]
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('web')->attempt($credentials, $request->post('rememberMe', false))) {
            $redirectTo = $request->user()->status === UserStatusEnum::STATUS_ACTIVE ? '/app' : '/profile';
            $token = $request->user()->createToken('apiToken')->plainTextToken;

            return Response::json([
                'message' => 'Successfully logged in',
                'token' => explode('|', $token)[1],
                'redirectTo' => $redirectTo,
            ], 302);
        }

        return Response::json([
            'message' => 'Incorrect email and/or password',
        ], 401);
    }

    /*
     * @OA\Get(
     *     path:"/api/v1/user/verify-email",
     *     summary:"Activate an account by verifying their email using a verification key",
     *     description:"It is required to provide the verification key sent via e-mail after the successful signup",
     *     tags: ['guest'],
     *
     *     @OA\Parameter(required:true, name:"email", in:"query",
     *         @OA\Schema(type:"string", example:"john.doe@example.com")
     *     ),
     *     @OA\Parameter(required:true, name:"verificationKey", in:"query",
     *         @OA\Schema(type:"string", example:"57c131437cc7885444087a775884d453")
     *     ),
     *
     *     @OA\Response(response:"200", description:"Success",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message",
     *                 type:"string",
     *                 example:"Email has been verified. The user's account is active now"
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response:"410", description:"Gone",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message",
     *                 type:"string",
     *                 example:"The user's email is already verified or the verification key is expired"
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response:"422", description:"Unprocessable Entity",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message", type:"string", example:"Account with this email was not found"),
     *             @OA\Property(property:"errors", type:"object",
     *                 @OA\Property(property:"email", type:"array",
     *                     @OA\Items(type:"string", example:"Account with this email was not found")
     *                 ),
     *             ),
     *         ),
     *     ),
     * )
     *
     * @param EmailVerifyRequest $request
     * @return JsonResponse
     */
    public function performEmailVerify(EmailVerifyRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = User::query()->where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return Response::json([
                'message' => "The user's email is already verified",
            ], 410);
        }

        if (true /*match the verification key with email*/) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return Response::json([
            'message' => "Email has been verified. The user's account is active now",
        ]);
    }

    /*
     * @OA\Post(
     *     path:"/api/v1/user/verify-email",
     *     summary:"Resend email verification link",
     *     description:"Re-sends over email the verification key to activate an account",
     *     tags: ['guest'],
     *
     *     @OA\RequestBody(required:true,
     *         @OA\MediaType(mediaType:"application/json",
     *             @OA\Schema(type:"object",
     *                 @OA\Property(property:"email", type:"string", example:"john.doe@example.com"),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response:"200", description:"Success",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message",
     *                 type:"string",
     *                 example:"Email has been verified. The user's account is active now"
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response:"422", description:"Unprocessable Entity",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message", type:"string", example:"Account with this email was not found"),
     *             @OA\Property(property:"errors", type:"object",
     *                 @OA\Property(property:"email", type:"array",
     *                     @OA\Items(type:"string", example:"Account with this email was not found")
     *                 ),
     *             ),
     *         ),
     *     ),
     * )
     *
     * @param EmailVerifyRequest $request
     * @return JsonResponse
     */
    public function requestEmailVerify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // rules
            'email' => ['required', 'email', 'exists:users,email'],
        ], [
            // messages
            'email.exists' => 'Account with this email was not found',
        ]);

        /** @var User $user */
        $user = User::query()->where('email', $validated['email'])->first();
        $user->sendEmailVerificationNotification();

        return Response::json([
            'message' => 'success',
        ]);
    }

    /*
     * @OA\Post(
     *     path:"/api/v1/user/password-reset",
     *     summary:"Request a token for reset password on an account",
     *     description:"The token will be sent over e-mail to the specified e-mail address",
     *     tags: ['guest'],
     *
     *     @OA\RequestBody(required:true,
     *         @OA\MediaType(mediaType:"application/json",
     *             @OA\Schema(type:"object",
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response:"200", description:"Work in Progress",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message", type:"string", example:"Work in Progress")
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

    /*
     * @OA\Put(
     *     path:"/api/v1/user/password-reset",
     *     summary:"Perform the password reset using the token received over e-mail and a new desired password",
     *     description:"The token expires 60 minutes after it was issued. The password should be confirmed",
     *     tags: ['guest'],
     *
     *     @OA\Response(response:"200", description:"Work in Progress",
     *         @OA\JsonContent(type:"object",
     *             @OA\Property(property:"message", type:"string", example:"Work in Progress")
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
}
