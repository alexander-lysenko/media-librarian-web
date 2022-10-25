<?php

namespace App\Services;

use App\Exceptions\ConfigurationException;
use App\Models\SqliteCollectionMeta;
use App\Utils\Enum\InputDataTypeEnum;
use Illuminate\Database\Connection;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\Grammars\SQLiteGrammar as SQLiteQueryGrammar;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ColumnDefinition;
use Illuminate\Database\Schema\Grammars\SQLiteGrammar as SQLiteSchemaGrammar;
use Illuminate\Support\Facades\Auth;
use JsonException;
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
    private Connection $connection;

    /**
     * The name of the table where the user's collections metadata is stored
     */
    private string $collectionMetaTable = 'sqlite_collection_meta';

    /**
     * UserDatabaseService constructor.
     */
    public function __construct(?int $userId = null)
    {
        try {
            $this->setUserId($userId ?: Auth::user()->getAuthIdentifier());
            $this->setDbConnection();
        } catch (ConfigurationException) {
            // Todo: handle (write a log)
        }
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

    /**
     * Inserts an entry into collection metadata table and returns the primary key of the entry
     * @param string $tableName
     * @param mixed $meta
     * @return int
     * @throws JsonException
     */
    public function insertMetadataReturningId(string $tableName, mixed $meta): int
    {
        $schema = $this->connection->query()
            ->select('sql')
            ->from('sqlite_master')
            ->where('type', '=', 'table')
            ->where('name', $tableName)
            ->pluck('sql')
            ->first();

        $model = new SqliteCollectionMeta([
            'tbl_name' => $tableName,
            'schema' => $schema,
            'meta' => json_encode($meta, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ]);
        $model->setDatabaseService($this)->save();

        return $model->id;
    }

    /**
     * Selects the full row(s) of metadata for one or all collection(s).
     * If $tableName not specified, the result contains metadata for all collections.
     * @param string|null $tableName
     * @return SqliteCollectionMeta[]
     */
    public function getMetadata(?string $tableName = null): array
    {
        $metadataQuery = (new SqliteCollectionMeta)->setDatabaseService($this)->newQuery();
        if (!empty($tableName)) {
            $metadataQuery->where('tbl_name', '=', $tableName);
        }

        return $metadataQuery->get()->all();
    }

    /**
     * Allows the collection creating tool to map the field's input type with a specific data type.
     * Creates a table column with the specified data type depending on the field's input type.
     * @param Blueprint $table
     * @param string $name
     * @param string $type
     * @return ColumnDefinition
     */
    public function createTableColumnByType(Blueprint $table, string $name, string $type): ColumnDefinition
    {
        return match ($type) {
            InputDataTypeEnum::LINE_INPUT => $table->lineString($name)->nullable(),
            InputDataTypeEnum::TEXT_INPUT => $table->text($name)->nullable(),
            InputDataTypeEnum::DATE_INPUT => $table->date($name)->nullable(),
            InputDataTypeEnum::DATETIME_INPUT => $table->timestamp($name)->nullable(),
            InputDataTypeEnum::URL_INPUT => $table->string($name)->nullable(),
            InputDataTypeEnum::CHECKBOX_INPUT => $table->boolean($name)->nullable(),
            InputDataTypeEnum::RATING5_INPUT => $table->unsignedTinyInteger($name)->nullable(),
            InputDataTypeEnum::RATING10_INPUT => $table->unsignedSmallInteger($name)->nullable(),
            InputDataTypeEnum::PRIORITY_INPUT => $table->tinyInteger($name)->nullable(),
        };
    }
}
