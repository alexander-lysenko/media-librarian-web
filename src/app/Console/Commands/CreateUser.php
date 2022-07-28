<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Throwable;

/**
 * Create (register) a new user through console
 */
class CreateUser extends Command
{
    protected $signature = 'user:create ' .
    '{--u|name= : "User Name" of the newly created user}' .
    '{--e|email= : E-mail address the account is created with}' .
    '{--p|password= : Set a password for the newly created user}';

    protected $description = 'Create (register) a new user through console';

    /**
     * Execute the console command.
     * https://laravel.com/docs/9.x/artisan
     *
     * @return void
     * @throws Throwable
     */
    public function handle(): void
    {

        // Enter username, if not present via command line option
        $name = $this->option('username') ?: $this->ask('Please enter a username.');

        // Enter email, if not present via command line option
        $email = $this->option('email') ?: $this->ask('Please enter an e-Mail.');

        // Enter password securely, if not present via command line option
        $password = $email = $this->option('password') ?: $this->secret('Please enter a new password.');

        $user = new User([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'status' => 'ACTIVE',
        ]);

        if ($user->saveOrFail()) {
            $this->info("New user ({$name} <{$email}>) has been created with ID {$user->id}");
        } else {
            $this->warn('User has not been created due to the following errors:');
        }
    }
}
