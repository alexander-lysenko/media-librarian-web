<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

/**
 * The application's global HTTP kernel
 */
class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     * These middlewares are run during every request to your application.
     *
     * @var array<int, class-string|string>
     * @noinspection PhpFullyQualifiedNameUsageInspection
     */
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\TrustHosts::class,
        \App\Http\Middleware\TrustProxies::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \App\Http\Middleware\TrimStrings::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array<string, array<int, class-string|string>>
     * @noinspection PhpFullyQualifiedNameUsageInspection
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\VerifyCsrfToken::class,
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        ],
        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \App\Http\Middleware\DatabaseSwitch::class,
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ],
    ];

    /**
     * The application's route middleware.
     * These middlewares may be assigned to a group or used individually.
     *
     * @var array<string, class-string|string>
     * @noinspection PhpFullyQualifiedNameUsageInspection
     */
    protected $routeMiddleware = [
        // 'auth' => Authenticate::class,
        // 'auth.basic' => AuthenticateWithBasicAuth::class,
        // 'auth.session' => AuthenticateSession::class,
        'auth.bearer' => \App\Http\Middleware\AuthenticateWithBearer::class,
        'auth' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle.captcha' => \App\Http\Middleware\ThrottleWithCaptcha::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
    ];
}
