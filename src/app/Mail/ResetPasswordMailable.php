<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class ResetPasswordMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        /** The name of the user the email is addressed to */
        public string $username,
        /** The email address the message will be sent to. It is not always the actual user's address */
        public string $email,
        /** The confirmation token (previously generated) */
        public string $token,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('email.resetPass.title'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
        // view: 'mail.password-reset', // this requires both Markdown and plain text templates
            markdown: 'mail.password-reset',
            with: [
                'username' => $this->username,
                'email' => $this->email,
                'resetPasswordLink' => $this->createConfirmationLink(),
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
            name: 'password.reset',
            expiration: now()->addHours(4),
            parameters: ['token' => $this->token]
        );
    }
}
