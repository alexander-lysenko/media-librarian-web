<?php

namespace App\Events;

use App\Models\EmailConfirmation;
use Illuminate\Auth\Events\Registered as IlluminateRegistered;
use Illuminate\Auth\Passwords\DatabaseTokenRepository;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Support\Facades\Password;

class Registered extends IlluminateRegistered
{
    use Dispatchable;

    /**
     * Create a new event instance.
     */
    public function __construct(public $user, protected string $email)
    {
        parent::__construct($user);
        $this->createConfirmationToken();
    }

    private function createConfirmationToken(): void
    {
        /** @var DatabaseTokenRepository $repository */
        $repository = Password::getRepository();

        EmailConfirmation::create([
            'user_id' => $this->user->id,
            'email' => $this->email,
            'token' => $repository->createNewToken(),
        ]);
    }
}
