<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailNotification;
use App\Utils\Enum\UserStatusEnum;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Authenticate-able user model
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 * @property string $email_verified_at
 *
 * @property PersonalSetting $settings
 * @property EmailConfirmation[] $email_confirmations
 * @property PasswordReset[] $password_resets
 *
 * @method static User create(array $attributes = [])
 * @method Builder update(array $values)
 */
class User extends AuthUser implements MustVerifyEmail, HasLocalePreference
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'deleted_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Get the user's preferred locale.
     *
     * @return string
     */
    public function preferredLocale(): string
    {
        return $this->settings->locale;
    }

    /**
     * Determine if the user has verified their email address.
     *
     * @return bool
     */
    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }

    /**
     * Mark the given user's email as verified.
     *
     * @return bool
     */
    public function markEmailAsVerified(): bool
    {
        $isFreshUser = $this->status === UserStatusEnum::CREATED->value;
        $this->forceFill([
            'status' => $isFreshUser ? UserStatusEnum::ACTIVE->value : $this->status,
            'email_verified_at' => $this->freshTimestamp(),
        ]);

        return $this->save();
    }

    /**
     * Get the email address that should be used for verification.
     *
     * @return string
     */
    public function getEmailForVerification(): string
    {
        /** @var EmailConfirmation $confirmation */
        $confirmation = $this->email_confirmations()->latest()->firstOr(function () {
            throw new ModelNotFoundException('Email confirmation token was not found.');
        });

        return $confirmation->email;
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(): void
    {
        /** @var EmailConfirmation $confirmation */
        $confirmation = $this->email_confirmations()->latest()->firstOr(function () {
            throw new RecordNotFoundException('Email confirmation token was not found.');
        });

        $this->notify(new VerifyEmailNotification($confirmation));
    }

    /**
     * Send the password reset notification.
     *
     * @param string $token
     * @return void
     */
    public function sendPasswordResetNotification(#[\SensitiveParameter] $token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Get the personal settings associated with the user.
     *
     * @return HasOne<PersonalSetting>
     */
    public function settings(): HasOne
    {
        return $this->hasOne(related: PersonalSetting::class, foreignKey: 'user_id', localKey: 'id');
    }

    /**
     * Get the email confirmation tokens associated with the user.
     *
     * @return HasMany<EmailConfirmation>
     * @noinspection PhpUnused
     */
    public function email_confirmations(): HasMany
    {
        return $this->hasMany(related: EmailConfirmation::class, foreignKey: 'user_id', localKey: 'id');
    }

    /**
     * Get the password reset tokens associated with the user.
     *
     * @return HasMany<PasswordReset>
     * @noinspection PhpUnused
     */
    public function password_resets(): HasMany
    {
        return $this->hasMany(related: PasswordReset::class, foreignKey: 'user_id', localKey: 'id');
    }
}
