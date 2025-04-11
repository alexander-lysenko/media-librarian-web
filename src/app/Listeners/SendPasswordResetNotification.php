<?php

namespace App\Listeners;

use App\Events\PasswordResetLinkSent;
use App\Models\PasswordReset;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Password;
use Mockery\Generator\StringManipulation\Pass\Pass;

class SendPasswordResetNotification
{
    /**
     * Handle the event.
     * @noinspection PhpPossiblePolymorphicInvocationInspection
     */
    public function handle(PasswordResetLinkSent $event): void
    {
        $passwordRepository = Password::getRepository();
        if ($event->user instanceof CanResetPassword && $passwordRepository->recentlyCreatedToken($event->user)) {
            $resetEntry = PasswordReset::query()
                ->where('user_id', $event->user->id)
                ->latest()
                ->first();

            $event->user->sendPasswordResetNotification($resetEntry->token);
        }
    }
}
