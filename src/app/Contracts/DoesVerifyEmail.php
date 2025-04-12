<?php

namespace App\Contracts;

use App\Models\EmailConfirmation;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasMany;

interface DoesVerifyEmail extends MustVerifyEmail
{
    /**
     * Get the email confirmation tokens associated with the entity (e.g., user).
     *
     * @return HasMany<EmailConfirmation>
     * @noinspection PhpUnused
     */
    public function email_confirmations(): HasMany;
}
