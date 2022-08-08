<?php

namespace App\Http\Middleware;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

/**
 * Middleware to authenticate using Bearer token
 */
class AuthenticateWithBearer extends Middleware
{
    /**
     * @param Request $request
     * @param array<int, Guard> $guards
     * @return void
     * @throws AuthenticationException
     */
    protected function unauthenticated($request, array $guards): void
    {
        $message = 'Authentication is required.';
        throw new AuthenticationException($message, $guards);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param Request $request
     * @return string|null
     */
    protected function redirectTo($request): ?string
    {
        if (!$request->expectsJson()) {
            return route('v1.user.login');
        }

        return null;
    }

}
