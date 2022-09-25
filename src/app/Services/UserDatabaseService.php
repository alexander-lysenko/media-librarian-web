<?php

namespace App\Services;

use Illuminate\Database\Connection;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\DB;

/**
 * User Database Service
 */
class UserDatabaseService
{
    /** User's Account ID. It is required to find the database storage for a specific user */
    public int $userId;

    /**
     * @param int $userId
     * @return UserDatabaseService
     */
    public function setUserId(int $userId): UserDatabaseService
    {
        $this->userId = $userId;
        return $this;
    }

    public function getDbConnection(): ConnectionInterface
    {

        return DB::connection(null);
    }

}
