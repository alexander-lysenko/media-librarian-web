<?php

namespace App\Notifications;

use App\Mail\ResetPasswordMailable;
use App\Models\PasswordReset;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;

class ResetPasswordNotification extends ResetPassword implements ShouldQueue
{
    use Queueable;

    /**
     * Determine which queues should be used for each notification channel.
     *
     * @return array<string, string>
     * @noinspection PhpUnused
     */
    public function viaQueues(): array
    {
        return [
            'mail' => 'notifications',
        ];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param string $notifiable
     * @return Mailable
     */
    public function toMail(mixed $notifiable): Mailable
    {
        $passwordReset = PasswordReset::query()->where('token', $notifiable)->firstOrFail();

        $mailable = new ResetPasswordMailable(
            username: $passwordReset->user->name,
            email: $passwordReset->email,
            token: $passwordReset->token
        );

        return $mailable->to($passwordReset->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
