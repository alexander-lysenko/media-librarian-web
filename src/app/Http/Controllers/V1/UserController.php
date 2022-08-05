<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\SignupRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
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
     *             @OA\Property(type="boolean", property="success", example=true),
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

//        $token = $user->createToken('apiToken')->plainTextToken;
        Event::dispatch(new Registered($user));

        return Response::json([
            'success' => true,
            'message' => 'Your account has been created. You have to verify your e-mail to activate the account',
            'user' => $user,
//            'token' => $token
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
     *                 @OA\Property(property="email", type="string", example="admin@example.com"),
     *                 @OA\Property(property="password", type="string", example="PasSw0rd"),
     *                 @OA\Property(property="rememberMe", type="boolean", example=true),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="302",
     *         description="Moved Permanently",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="boolean", property="success", example=true),
     *             @OA\Property(type="string", property="redirectTo", example="/app"),
     *             @OA\Property(type="string",
     *                 property="message",
     *                 example="Successfully logged in. Here is the authentication token."
     *             ),
     *             @OA\Property(type="string", property="token", example="token"),
     *         ),
     *     ),
     * )
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return Redirect::intended('/app');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/user/activate",
     *     summary="Activate account",
     *     description="To activate an account it is requred to verify its email address using a verification key.
     * The verification key is sent over e-mail rigth after the successful signup.",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\Response(response="default", description="Work in Progress", @OA\JsonContent())
     * )
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function activate(Request $request): JsonResponse
    {
        return Response::json([
            'message' => 'success',
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/password-reset",
     *     summary="Request for password reset",
     *     description="Request a token for reset password on an account. The token will be sent over e-mail to the \
     * specified e-mail address unless the email address is unrecognized (does not belong to a registered account).",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\Response(response="default", description="Work in Progress", @OA\JsonContent())
     * )
     *
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
     *     summary="Perform password reset",
     *     description="Provide the password reset token received over e-mail along with a new desired password.
     * The token expires 60 minutes after it was issued. The password should be confirmed (i.e. entered twice)",
     *     tags={"user.unauthenticated"},
     *
     *     @OA\Response(response="default", description="Work in Progress", @OA\JsonContent())
     * )
     *
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
     * @OA\Post(
     *     path="/api/v1/user/logout",
     *     summary="Logout",
     *     description="Sign out / Deauthenticate a user",
     *     tags={"user.authenticated"},
     *
     *     @OA\Response(response="302",
     *         description="Moved Permanently",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="boolean", property="success", example=true),
     *             @OA\Property(type="string", property="redirectTo", example="/user/login"),
     *             @OA\Property(type="string", property="message", example="Successfully logged out"),
     *         ),
     *     ),
     * )
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        $request->session()->flush();
        Auth::logout();

        return Redirect::intended('/user/login');
    }
}
