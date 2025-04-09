<?php

namespace App\Notifications;

use App\Mail\ResetPasswordMailable;
use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword as IlluminateResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;

class ResetPassword extends IlluminateResetPassword implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected readonly PasswordReset $passwordReset)
    {
        // todo: change connection
        $this->onConnection('sync');

        parent::__construct(token: $passwordReset->token);
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param User $notifiable
     * @return Mailable
     */
    public function toMail(mixed $notifiable): Mailable
    {
        $email = $this->passwordReset->email;
        $mailable = new ResetPasswordMailable(
            username: $notifiable->name,
            email: $email,
            token: $this->passwordReset->token
        );

        return $mailable->to($email);
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
