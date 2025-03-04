<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Translation\PotentiallyTranslatedString;

/**
 * A request validation rule to verify user's password under API endpoint to change password.
 *
 * @property string $email required to make credentials to perform authentication
 */
class PasswordValidationRule implements ValidationRule
{
    /**
     * Create a new rule instance.
     * @return void
     */
    public function __construct(private readonly string $email)
    {
    }

    /**
     * Run the validation rule.
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $credentials = ['email' => $this->email, 'password' => $value];

        if (!Auth::guard('web')->attempt($credentials)) {
            $fail(trans('auth.password'));
        }
    }
}
