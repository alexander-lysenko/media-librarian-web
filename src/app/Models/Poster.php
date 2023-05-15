<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * The model represents the table for poster. Designed for SQLite database
 *
 * @property int $id
 * @property int $user_id
 * @property int $library_id
 * @property int $item_id
 * @property string $uri
 * @property string $created_at
 * @property string $updated_at
 */
class Poster extends Model
{
    use HasFactory;

    /** @inheritdoc */
    public $fillable = [
        'user_id',
        'library_id',
        'item_id',
        'uri',
    ];
}
