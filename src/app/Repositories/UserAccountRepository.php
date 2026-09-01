<?php

namespace App\Repositories;

use App\Models\EmailConfirmation;
use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserAccountRepository
{
    public function __construct() {}

    public function createUser(
        string $name,
        string $email,
        string $password,
        string $locale = 'en',
        string $theme = 'dark'
    ): User {
        $user = User::create([
            'name' => $name,
            'email' => strtolower($email),
            'password' => Hash::make($password),
        ]);
        $user->settings()->create([
            'locale' => $locale,
            'theme' => $theme,
        ]);

        return $user;
    }

    public function getByEmail(string $email): User
    {
        return User::query()
            ->where(column: 'email', value: strtolower($email))
            ->firstOrFail();
    }

    public function createEmailConfirmationEntry(int $userId, string $email): EmailConfirmation
    {
        return EmailConfirmation::create([
            'user_id' => $userId,
            'email' => $email,
            'token' => hash_hmac('sha256', Str::random(40), $this->getHashKey()),
        ]);
    }

    public function createPasswordResetEntry(User $user): PasswordReset
    {
        return PasswordReset::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'token' => hash_hmac('sha256', Str::random(40), $this->getHashKey()),
        ]);
    }

    private function getHashKey(): string
    {
        $key = config('app.key');

        if (str_starts_with($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        return $key;
    }
}
