<?php

namespace App\Http\Middleware;

use App\Models\SqliteLibraryMeta;
use Closure;
use Illuminate\Database\Connection;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use PDO;

/**
 * Switch the database connection on-the-fly depending on the authenticated user's ID
 */
class DatabaseSwitch
{
    public const CONNECTION_PATH = 'sqlite_user_dependent';

    /**
     * Create a new filter instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $newConnectionPath = implode('.', ['database.connections', self::CONNECTION_PATH]);

        // Check if user logged in (This will work for an authenticated user only)
        if ($request->user()) {
            $userId = $request->user()->id;

            $dbConfig = Config::get('database.connections.sqlite');
            $dbConfig['database'] = storage_path("databases/libraries-$userId.sqlite");

            // This will create database if it does not exist
            if (!file_exists($dbConfig['database'])) {
                $dsn = "sqlite:{$dbConfig['database']}";
                $pdo = new PDO($dsn);
                $connection = new Connection($pdo);
                $connection->disconnect();
            }

            Config::set($newConnectionPath, $dbConfig);
            $this->testConnection();
        }

        return $next($request);
    }

    /**
     * Creates and executes a test query under the established connection.
     * Actually checks the presence of the table required to store the metadata of a created Library,
     *  and then creates the table if it doesn't exist.
     * @return void
     */
    private function testConnection(): void
    {
        $connection = DB::connection('sqlite_user_dependent');
        $sqliteLibraryMeta = new SqliteLibraryMeta();
        $tableName = $sqliteLibraryMeta->getTable();

        try {
            $connection->query()->select('id')->from($tableName)->first();
        } catch (QueryException) {
            $schema = $connection->getSchemaBuilder();
            if (!$schema->hasTable($tableName)) {
                $connection->statement('PRAGMA writable_schema = 1');
                $schema->create($tableName, function (Blueprint $table) {
                    $table->id();
                    $table->string('tbl_name');
                    $table->jsonb('schema');
                    $table->jsonb('meta')->nullable();
                    $table->timestamp('created_at');
                });
                $connection->statement('PRAGMA writable_schema = RESET');
            }
        }
    }
}
