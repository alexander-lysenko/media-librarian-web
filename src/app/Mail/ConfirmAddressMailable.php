<?php

namespace App\Mail;

use App\Utils\Enum\UserStatusEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

/**
 * A mailable class to send e-mail message when a user registers its account or changes e-mail address
 */
class ConfirmAddressMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        /** The name of the user the email is addressed to */
        private readonly string $username,
        /** The email address the message will be sent to. It is not always the actual user's address */
        public string $email,
        /** The confirmation token (previously generated) */
        private readonly string $token,
        /**
         * This has an impact on the email's contents.
         * If set to true, the message addresses to a user like they have just registered.
         */
        private readonly bool $isFirstMsg = false,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('mail.verification.title'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // $isFirstMsg = $notifiable->status === UserStatusEnum::CREATED->value;

        return new Content(
        // view: 'mail.confirm-address', // this requires both Markdown and plain text templates
            markdown: 'mail.confirm-address',
            with: [
                'username' => $this->username,
                'isFirstMessage' => $this->isFirstMsg,
                'confirmationLink' => $this->createConfirmationLink(),
                'contactEmail' => env('MAIL_ADMIN_ADDRESS', 'admin@example.com'),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Creates the confirmation link as temporary signed URL
     *
     * @return string
     */
    private function createConfirmationLink(): string
    {
        return URL::temporarySignedRoute(
            name: 'verification.verify',
            expiration: now()->addHours(48),
            parameters: ['email' => $this->email, 'token' => $this->token]
        );
    }
}
