<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * The model represents the table for poster. Designed for SQLite database
 *
 * @property int $id
 * @property int $user_id
 * @property int $collection_id
 * @property int $entry_id
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
        'collection_id',
        'entry_id',
        'uri',
    ];
}
