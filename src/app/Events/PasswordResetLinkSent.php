<?php

namespace App\Events;

use App\Models\PasswordReset;
use Illuminate\Auth\Events\PasswordResetLinkSent as IlluminatePasswordResetLinkSent;
use Illuminate\Auth\Passwords\DatabaseTokenRepository;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Password;

class PasswordResetLinkSent extends IlluminatePasswordResetLinkSent
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public $user)
    {
        parent::__construct($user);
        $this->createResetToken();
    }

    private function createResetToken(): void
    {
        /** @var DatabaseTokenRepository $repository */
        $repository = Password::getRepository();

        PasswordReset::create([
            'user_id' => $this->user->id,
            'email' => $this->user->getEmailForPasswordReset(),
            'token' => $repository->createNewToken(),
        ]);
    }
}
