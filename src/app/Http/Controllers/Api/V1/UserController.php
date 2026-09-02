<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\PasswordResetLinkSent;
use App\Events\Registered;
use App\Http\Controllers\Api\ApiV1Controller;
use App\Http\Requests\V1\PasswordResetPerformRequest;
use App\Http\Requests\V1\SignupRequest;
use App\Repositories\UserAccountRepository;
use App\Utils\Enum\UserStatusEnum;
use Illuminate\Auth\Events\PasswordReset as PasswordResetEvent;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * User controller - manage user/identity actions
 * @see https://github.com/laravel/breeze
 */
class UserController extends ApiV1Controller
{
    public function __construct(
        private readonly UserAccountRepository $accountRepository,
    ) {}

    #[OA\Post(
        path: '/api/v1/user/login',
        operationId: 'user-login',
        description: "Obtain an authentication (Bearer) token to access the API as an authenticated User.\n\n" .
        "\n\n **CAPTCHA-PROTECTED**" .
        "\n### Rate Limiter\n| Number of Requests | Time frame |\n| -- | -- |\n" .
        '| 3 | 2 hours (7200 seconds)',
        summary: 'Login / Obtain an Authentication Token',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                new OA\Property(property: 'password', type: 'string', example: 'PasSw0rd'),
                new OA\Property(property: 'rememberMe', type: 'boolean', example: true),
            ])
        ),
        tags: ['auth'],
        responses: [
            new OA\Response(
                response: 299,
                description: 'Stub to control "Accept" header by Swagger. Never used anywhere else.',
                content: new OA\MediaType(mediaType: 'application/json')
            ),
            new OA\Response(
                response: 302,
                description: 'Moved Temporarily',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Successfully logged in'),
                    new OA\Property(property: 'token', type: 'string', example: '00000000000000000000000000000000000'),
                    new OA\Property(property: 'redirectTo', type: 'string', example: '/app'),
                ])
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthorized',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Incorrect email and/or password'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_429_REF, response: 429),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::guard('web')->attempt($credentials, $request->boolean('rememberMe'))) {
            $user = Auth::guard('web')->authenticate();
            $token = $user->createToken('apiToken')->plainTextToken;
            $redirectTo = $user->status === UserStatusEnum::ACTIVE ? '/app' : '/profile';

            return new JsonResponse([
                'message' => trans('common.auth.success'),
                'token' => explode('|', $token)[1],
                'redirectTo' => $redirectTo,
            ], Response::HTTP_FOUND);
        }

        return new JsonResponse(['message' => trans('common.auth.invalid')], Response::HTTP_UNAUTHORIZED);
    }

    #[OA\Post(
        path: '/api/v1/user/signup',
        operationId: 'user-signup',
        description: 'Registers a new account. This account initially has limited permissions until its owner ' .
        "confirms email address.\\\n The confirmation link will be sent to the email address mentioned " .
        "in the request as a successful result of the operation\\\n " .
        'This email address is used for both account identification and authentication purposes.' .
        "\n\n **CAPTCHA-PROTECTED**" .
        "\n### Rate Limiter\n| Number of Requests | Time frame |\n| -- | -- |\n" .
        '| 1 | 6 hours (21600 seconds)',
        summary: 'Sign up a new User',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john.doe@example.com'),
                new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                new OA\Property(property: 'password', type: 'string', example: 'PasSw0rd'),
                new OA\Property(property: 'passwordRepeat', type: 'string', example: 'PasSw0rd'),
                new OA\Property(property: 'locale', type: 'string', example: 'en'),
                new OA\Property(property: 'theme', type: 'string', example: 'dark'),
            ])
        ),
        tags: ['auth'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(
                        property: 'message',
                        type: 'string',
                        example: 'Your account has been created. Please verify your e-mail to activate your account'
                    ),
                    new OA\Property(property: 'user', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                        new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                    ]),
                ])
            ),
            new OA\Response(
                response: 422,
                description: 'Unprocessable Entity',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'errors', properties: [
                        new OA\Property(
                            property: 'email',
                            type: 'array',
                            items: new OA\Items(type: 'string', example: 'Email is required'),
                        ),
                    ]),
                ]),
            ),
        ]
    )]
    public function signup(SignupRequest $request): JsonResponse
    {
        $user = $this->accountRepository->createUser(
            name: $request->name,
            email: $request->email,
            password: $request->password,
            locale: $request->locale,
            theme: $request->theme
        );

        Event::dispatch(new Registered($user, $user->email));

        return new JsonResponse([
            'message' => trans('common.signup.created') . ' ' . trans('common.signup.mustConfirmEmail'),
            'user' => $user,
        ], Response::HTTP_CREATED);
    }

    #[OA\Post(
        path: '/api/v1/user/password-reset',
        operationId: 'user-password-reset-request',
        description: 'The token will be sent over e-mail to the specified e-mail address' .
        'The token expires 240 minutes (4 hours) after it was issued. The password must be repeated to confirm.' .
        "\n\n **CAPTCHA-PROTECTED**" .
        "\n### Rate Limiter\n| Number of Requests | Time frame |\n| -- | -- |\n" .
        '| 1 | 6 hours (21600 seconds)',
        summary: 'Request Password Reset',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
            ])
        ),
        tags: ['auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Success',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Password reset token has been sent'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function requestPasswordReset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'], // validating the presence of the email is intentionally omitted
        ]);

        try {
            $user = $this->accountRepository->getByEmail($validated['email']);
            Event::dispatch(new PasswordResetLinkSent($user));
        } catch (ModelNotFoundException) {
            // Do nothing. User doesn't need to know that the account may not exist
        }

        return new JsonResponse(['message' => trans('common.password.sent')]);
    }

    #[OA\Put(
        path: '/api/v1/user/password-reset',
        operationId: 'user-password-reset',
        description: 'Performs the password reset with a new desired password using the token received over e-mail.' .
        "The token expires 240 minutes (4 hours) after it was issued. Password must be repeated to confirm.\n\n" .
        'Email address is used to identify the account that requested password reset, ' .
        'it must not be available to change through the request.',
        summary: 'Perform Password Reset',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                new OA\Property(property: 'newPassword', type: 'string', example: 'NewPassword1234'),
                new OA\Property(property: 'repeatPassword', type: 'string', example: 'NewPassword1234'),
                new OA\Property(property: 'token', type: 'string', example: '00000000000000000000000000000000'),
            ])
        ),
        tags: ['auth'],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function performPasswordReset(PasswordResetPerformRequest $request): JsonResponse
    {
        $email = strtolower($request->email);
        $newPassword = Hash::make($request->newPassword);

        try {
            $user = $this->accountRepository->getByEmail($email);
            $user->forceFill(['password' => $newPassword])->save();

            Event::dispatch(new PasswordResetEvent($user));
        } catch (ModelNotFoundException) {
            return new JsonResponse(data: [
                'message' => 'user not found',
            ], status: Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
    }
}
