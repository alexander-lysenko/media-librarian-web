<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

/**
 * A mailable class to send e-mail message when a user registers its account or changes e-mail address
 */
class ConfirmAddress extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        private readonly string $username,
        private readonly string $token,
        private readonly bool $isFirstMsg = false,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans('email.confirm.title'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
        // view: 'mail.confirm-address', // this requires both Markdown and plain text templates
            markdown: 'mail.confirm-address',
            with: [
                'username' => $this->username,
                'isFirstMessage' => $this->isFirstMsg,
                'confirmationLink' => URL::temporarySignedRoute(
                    name: 'email-confirmation',
                    expiration: now()->addHours(48),
                    parameters: ['token' => $this->token]
                ),
                'contactEmail' => 'admin@example.com',
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
