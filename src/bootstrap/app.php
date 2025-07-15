<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__));

$app->withRouting(
    web: __DIR__ . '/../routes/web.php',
    api: __DIR__ . '/../routes/api.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
);

$app->withMiddleware(callback: function (Middleware $middleware): void {
    $middleware->preventRequestsDuringMaintenance();
    $middleware->encryptCookies(except: ['appearance']);
    $middleware->convertEmptyStringsToNull();
    $middleware->trimStrings();
    $middleware->trustHosts();
    // $middleware->validateSignatures();

    $middleware->append(middleware: [
        // App\Http\Middleware\HandleCors::class,
        Illuminate\Http\Middleware\HandleCors::class,
        Illuminate\Http\Middleware\ValidatePostSize::class,
    ]);

    $middleware->web(append: [
        App\Http\Middleware\AcceptLanguage::class,
        Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        Illuminate\Session\Middleware\StartSession::class,
        Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);

    $middleware->api(append: [
        'throttle:api',
        Illuminate\Routing\Middleware\SubstituteBindings::class,
        App\Http\Middleware\DatabaseSwitch::class,
    ]);

    $middleware->alias(aliases: [
        'throttle.captcha' => App\Http\Middleware\ThrottleWithCaptcha::class,
        'auth.bearer' => App\Http\Middleware\AuthenticateWithBearer::class,
        'auth' => App\Http\Middleware\RedirectIfAuthenticated::class,
        'throttle' => Illuminate\Routing\Middleware\ThrottleRequests::class,
        'can' => Illuminate\Auth\Middleware\Authorize::class,
        'verified' => Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'password.confirm' => Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => Illuminate\Routing\Middleware\ValidateSignature::class,
        'cache.headers' => Illuminate\Http\Middleware\SetCacheHeaders::class,
    ]);
});

$app->withSchedule(callback: function (Schedule $schedule): void {
    $schedule->command(command: 'sanctum:prune-expired --hours=24')->daily();
});

$app->withExceptions(using: function (Exceptions $exceptions): void {
    //
});

return $app->create();
