<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\SignupRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use OpenApi\Annotations as OA;

/**
 * User controller - manage user/identity actions
 */
class UserController extends ApiV1Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/user/signup",
     *     summary="Register a new user",
     *     description="Sign up a new user",
     *     tags={"user"},
     *
     *     @OA\RequestBody(required=true,
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
     *     @OA\Response(response="default", description="Work in Progress", @OA\JsonContent())
     * )
     *
     * @param SignupRequest $request
     * @return JsonResponse
     */
    public function signup(SignupRequest $request): JsonResponse
    {

        return Response::json([]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user/login",
     *     summary="Sign In / Authenticate a user",
     *     description="Login",
     *     tags={"user"},
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
     *     @OA\Response(response="default", description="Work in Progress", @OA\JsonContent())
     * )
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
