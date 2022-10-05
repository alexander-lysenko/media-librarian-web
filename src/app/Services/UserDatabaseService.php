<?php

namespace App\Services;

use App\Exceptions\ConfigurationException;
use Illuminate\Database\Connection;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\Grammars\SQLiteGrammar as SQLiteQueryGrammar;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Grammars\SQLiteGrammar as SQLiteSchemaGrammar;
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
     * Reusable connection to the user's database
     */
    private ?Connection $connection = null;

    /**
     * The name of the table where the user's collections metadata is stored
     */
    private string $collectionMetaTable = 'sqlite_collection_meta';

    /**
     * UserDatabaseService constructor.
     */
    public function __construct()
    {
    }

    /**
     * Sets a user's ID. It is required to make a connection to the database of a specified user by its ID
     * @param int $userId
     * @return UserDatabaseService
     */
    public function setUserId(int $userId): UserDatabaseService
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * Get the user's database connection or create it when it is not generated before
     * @return Connection
     */
    public function getDbConnection(): Connection
    {
        if ($this->connection === null) {
            try {
                $this->setDbConnection();
            } catch (ConfigurationException) {
                // Todo: handle (write a log)
            }
        }

        return $this->connection;
    }

    /**
     * Generate a Connection instance to the database storage for a specific user
     * @return void
     * @throws ConfigurationException
     */
    private function setDbConnection(): void
    {
        if (!$this->userId) {
            throw new ConfigurationException('Required property "userId" is missing');
        }

        $database_path = storage_path("app/databases/collections-$this->userId.sqlite");
        $dsn = "sqlite:$database_path";

        $pdo = new PDO($dsn);
        $connection = new Connection($pdo);
        $connection->setSchemaGrammar(new SQLiteSchemaGrammar());
        $connection->setQueryGrammar(new SQLiteQueryGrammar());

        $this->connection = $connection;
        $this->testConnection(); // Doesn't work
    }

    /**
     * Creates and executes a test query under the established connection.
     * Actually checks the presence of the table required for storing collection metadata
     *  and creates the table if it doesn't exist
     * @return void
     */
    private function testConnection(): void
    {
        $connection = $this->connection;
        try {
            $connection->query()->select('id')->from($this->collectionMetaTable)->first();
        } catch (QueryException) {
            $schema = $connection->getSchemaBuilder();
            if (!$schema->hasTable($this->collectionMetaTable)) {
                $connection->statement('PRAGMA writable_schema = 1');
                $schema->create($this->collectionMetaTable, function (Blueprint $table) {
                    $table->id();
                    $table->string('tbl_name');
                    $table->jsonb('schema');
                    $table->jsonb('meta')->nullable();
                });
                $connection->statement('PRAGMA writable_schema = RESET');
            }
        }
    }

    /**
     * Creates a query builder from an existing connection (shorthand for $connection->query())
     * @return Builder
     */
    public function getQuery(): Builder
    {
        return $this->connection->query();
    }
}
