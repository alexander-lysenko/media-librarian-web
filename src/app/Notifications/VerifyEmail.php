<?php

namespace App\Notifications;

use App\Mail\ConfirmAddressMailable;
use App\Models\EmailConfirmation;
use App\Models\User;
use App\Utils\Enum\UserStatusEnum;
use Illuminate\Auth\Notifications\VerifyEmail as IlluminateVerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;

/**
 * Notification entity to send the email confirmation message via email
 */
class VerifyEmail extends IlluminateVerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected readonly EmailConfirmation $emailConfirmation)
    {
        // todo: change connection
        $this->onConnection('sync');
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param User $notifiable
     * @return Mailable
     */
    public function toMail(mixed $notifiable): Mailable
    {
        $isFirstMsg = $notifiable->status === UserStatusEnum::CREATED->value;

        $mailable = new ConfirmAddressMailable(
            username: $notifiable->name,
            email: $this->emailConfirmation->email, // Usually this is not the user's current address
            token: $this->emailConfirmation->token,
            isFirstMsg: $isFirstMsg
        );

        return $mailable->to($this->emailConfirmation->email);
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
