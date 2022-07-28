<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Throwable;

/**
 * Create (register) a new user through console
 */
class CreateUser extends Command
{
    protected $signature = 'user:create ' .
    '{username : "User Name" of the new user}' .
    '{email : E-mail address the account is created with}' .
    '{password : Set a password for the new user}';

    protected $description = 'Create (register) a new user through console';

    /**
     * CreateUser constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @throws Throwable
     */
    public function handle(): void
    {
        $username = $this->argument('username');
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = new User([
            'name' => $username,
            'email' => $email,
            'password' => $password,
        ]);
        $user->saveOrFail();

        $this->info("New user ({$email}) has been created as \"{$username}\"!");
    }

}
