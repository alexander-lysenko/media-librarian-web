<?php

namespace App\Services;

use App\Exceptions\ConfigurationException;
use Illuminate\Database\Connection;
use Illuminate\Database\Schema\Grammars\SQLiteGrammar as SQLiteSchemaGrammar;
use Illuminate\Database\Query\Grammars\SQLiteGrammar as SQLiteQueryGrammar;
use PDO;

/**
 * User Database Service
 */
class UserDatabaseService
{
    /**
     * User's Account ID.
     * It is required to find the database storage for a specific user
     */
    private int $userId;

    /**
     * UserDatabaseService constructor.
     */
    public function __construct()
    {
    }


    /**
     * @param int $userId
     * @return UserDatabaseService
     */
    public function setUserId(int $userId): UserDatabaseService
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * Generate a Connection instance to the database storage for a specific user
     * @return Connection
     * @throws ConfigurationException
     */
    public function getDbConnection(): Connection
    {
        if (!$this->userId) {
            throw new ConfigurationException('Required property "userId" is missing');
        }

        $database_path = storage_path("app/databases/collections-{$this->userId}.sqlite");
        $dsn = "sqlite:{$database_path}";

        $pdo = new PDO($dsn);
        $connection = new Connection($pdo);
        $connection->setSchemaGrammar(new SQLiteSchemaGrammar());
        $connection->setQueryGrammar(new SQLiteQueryGrammar());

        return $connection;
    }
}
