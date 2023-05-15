<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Throwable;

/**
 * Create (register) a new user through console
 */
class CreateUser extends Command
{
    protected $signature = 'user:create ' .
    '{--u|name= : The "User Name" of the newly created user}' .
    '{--e|email= : The e-mail address the account is created with}' .
    '{--p|password= : The password for the newly created user}';

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
        $this->comment('NOTE: The user account created from here bypasses the email confirmation.');
        $this->comment('The activation of the new account is processed immediately.');
        $this->comment('Recovering such accounts using the standard tools may cause issues.');
        $this->comment("YOU'VE BEEN WARNED!");
        $this->comment('=========================');

        // Enter username, if not present via command line option
        $name = $this->option('name') ?: $this->ask('Please enter a username');
        // Enter email, if not present via command line option
        $email = $this->option('email') ?: $this->ask('Please enter an e-mail');
        // Enter password securely, if not present via command line option
        $password = $this->option('password') ?: $this->secret('Please enter a new password');

        $this->line('Collected all the necessary data. Processing...', verbosity: 'v');

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:8'],
        ]);

        if ($validator->fails()) {
            $this->info('The given data was invalid:');
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return;
        }

        // When validation passes, proceed to insert into database
        try {
            $userId = DB::table('users')->insertGetId([
                'name' => $name,
                'email' => trim($email),
                'password' => Hash::make($password),
                'email_verified_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'status' => 'ACTIVE',
            ]);
            $this->info("New user ({$name} <{$email}>) has been created with ID {$userId}");
        } catch (QueryException $e) {
            $this->warn('User has not been created due to the following errors:');
            $this->error($e->getMessage());
        }
    }
}
