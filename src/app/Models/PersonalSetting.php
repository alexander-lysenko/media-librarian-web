<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Additional properties and preferences for User entity.
 *
 * @property int $id
 * @property int $user_id
 * @property string $locale
 * @property string $theme
 * @property string $avatar
 * @property mixed $metadata
 * @property string $created_at
 * @property string $updated_at
 */
class PersonalSetting extends Model
{
    use HasFactory;

    /** @inheritdoc */
    public $fillable = [
        'user_id',
        'locale',
        'theme',
        'avatar',
        'metadata',
    ];

    /** @inheritdoc */
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];
}
