<?php

namespace App\Listeners;

use App\Contracts\DoesResetPassword;
use App\Events\PasswordResetLinkSent;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendPasswordResetNotification
{
    /**
     * Handle the event.
     */
    public function handle(PasswordResetLinkSent $event): void
    {
        if ($event->user instanceof DoesResetPassword) {
            $resetEntry = $event->user->password_resets()->latest()->first();

            $event->user->sendPasswordResetNotification($resetEntry->token);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(PasswordResetLinkSent $event, Throwable $exception): void
    {
        Log::error($exception);
    }
}
