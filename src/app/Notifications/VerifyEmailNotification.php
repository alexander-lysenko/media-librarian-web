<?php

namespace App\Notifications;

use App\Mail\ConfirmAddressMailable;
use App\Models\EmailConfirmation;
use App\Models\User;
use App\Utils\Enum\UserStatusEnum;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;

/**
 * Notification entity to send the email confirmation message via email
 */
class VerifyEmailNotification extends VerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected readonly EmailConfirmation $emailConfirmation) {}

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
     * @param User $notifiable
     * @return Mailable
     */
    public function toMail(mixed $notifiable): Mailable
    {
        $isFirstMsg = $notifiable->status === UserStatusEnum::CREATED;

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
