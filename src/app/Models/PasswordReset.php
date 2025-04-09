<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * This model represents "password_resets" table
 *
 * @property int $id
 * @property int $user_id
 * @property string $email
 * @property string $token
 * @property string $created_at
 *
 * @property User $user
 * @method static create(array $attributes = [])
 */
class PasswordReset extends Model
{
    public const UPDATED_AT = null;

    public const TABLE = 'password_resets';

    /** @inheritdoc */
    protected $fillable = [
        'user_id',
        'email',
        'token',
    ];

    /** @inheritdoc */
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Get the User that the password reset token associated with.
     *
     * @return HasOne
     */
    public function user(): HasOne
    {
        return $this->hasOne(related: User::class, foreignKey: 'id', localKey: 'user_id');
    }
}
