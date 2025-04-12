<?php

namespace App\Contracts;

use App\Models\PasswordReset;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Relations\HasMany;

interface DoesResetPassword extends CanResetPassword
{
    /**
     * Get the password reset tokens associated with the entity (e.g., user).
     *
     * @return HasMany<PasswordReset>
     * @noinspection PhpUnused
     */
    public function password_resets(): HasMany;
}
