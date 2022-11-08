<?php

namespace App\Models;

use App\Services\UserDatabaseService;
use Illuminate\Database\Connection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

/**
 * The model represents the collection metadata table. Designed for SQLite database
 *
 * @property int $id
 * @property string $tbl_name
 * @property string $schema
 * @property string $meta
 */
class SqliteCollectionMeta extends Model
{
    use HasFactory;

    /** @inheritdoc */
    public $fillable = [
        'tbl_name',
        'schema',
        'meta',
    ];

    /** @inheritdoc */
    protected $table = 'sqlite_collection_meta';

    /** @inheritdoc */
    public $timestamps = true;

    /** @inheritdoc */
    protected $connection = null;

    private UserDatabaseService $dbService;

    /**
     * @inheritdoc
     * @return null
     */
    public function getUpdatedAtColumn()
    {
        return null;
    }

    /**
     * Get an instance of UserDatabaseService from te app's bootstrap to create a database connection on-the-fly.
     * The service will be ready to create a connection for the user's database
     * If $userId is not specified, the ID of the authenticated user (from Request::$user) will be used.
     * @param int|null $userId
     * @return $this
     */
    protected function makeDatabaseService(?int $userId = null): self
    {
        $this->dbService = App::make(UserDatabaseService::class);
        if (!empty($userId)) {
            $this->dbService->setUserId($userId);
        }

        return $this;
    }

    /**
     * Set an instance of UserDatabaseService to create a database connection on-the-fly.
     * @param UserDatabaseService $service
     * @return $this
     */
    public function setDatabaseService(UserDatabaseService $service): self
    {
        $this->dbService = $service;

        return $this;
    }

    /**
     * The way to get a database connection has been overridden to substitute a generated connection
     * to the database of a specific user.
     * @see setDatabaseService
     * @see makeDatabaseService
     * @return Connection
     */
    public function getConnection(): Connection
    {
        return $this->dbService->getDbConnection();
    }
}
