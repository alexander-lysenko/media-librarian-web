<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * The model represents a service table for cataloging posters
 * that are attached to a Library Item and uploaded to the external storage.
 *
 * @property int $uuid
 * @property int $user_id
 * @property int $library_id
 * @property int $item_id
 * @property string $path
 * @property string $created_at
 * @property string $updated_at
 */
class Poster extends Model
{
    use HasFactory;

    /** @inheritdoc */
    public $fillable = [
        'uuid',
        'user_id',
        'library_id',
        'item_id',
        'path',
    ];

    public function getResourceLink()
    {
        return route('posters.cloudLink', ['uuid' => $this->uuid]);
    }
}
