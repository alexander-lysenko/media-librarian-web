<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification as IlluminateSendEmailVerificationNotification;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendEmailVerificationNotification extends IlluminateSendEmailVerificationNotification
{
    /**
     * Handle the event.
     *
     * @param Registered $event
     * @return void
     */
    // public function handle(Registered $event)
    // {
    //     if ($event->user instanceof MustVerifyEmail && ! $event->user->hasVerifiedEmail()) {
    //         $event->user->sendEmailVerificationNotification();
    //     }
    // }

    /**
     * Handle a job failure.
     */
    public function failed(Registered $event, Throwable $exception): void
    {
        Log::error($exception);
    }
}
