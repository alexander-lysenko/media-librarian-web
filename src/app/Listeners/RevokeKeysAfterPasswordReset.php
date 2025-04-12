<?php

namespace App\Listeners;

use App\Contracts\DoesResetPassword;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Contracts\HasApiTokens;
use Throwable;

class RevokeKeysAfterPasswordReset
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PasswordReset $event): void
    {
        // Revoke all password reset tokens issued before the password was changed
        if ($event->user instanceof DoesResetPassword) {
            $event->user->password_resets()->delete();
        }

        // Revoke all personal access tokens issued before the password was changed
        if ($event->user instanceof HasApiTokens) {
            $event->user->tokens()->delete();
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(PasswordReset $event, Throwable $exception): void
    {
        Log::error($exception);
    }
}
