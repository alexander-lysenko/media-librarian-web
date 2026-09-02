<?php

namespace App\Repositories;

use App\Models\SqliteLibraryMeta;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class LibraryRepository
{
    public function __construct() {}

    public function create(string $title, array $fields): SqliteLibraryMeta
    {
        $sqliteLibraryMeta = new SqliteLibraryMeta();
        $connection = $sqliteLibraryMeta->getConnection();

        $transactClosure = static function () use ($connection, $title, $fields): SqliteLibraryMeta {
            $createTableSchema = function (Blueprint $table) use ($fields) {
                $table->id();
                foreach ($fields as $name => $type) {
                    if ($name === array_key_first($fields)) {
                        $table->string($name, 255)->unique();
                        continue;
                    }
                    SqliteLibraryMeta::createTableColumnByType($table, $name, $type);
                }
            };

            $connection->getSchemaBuilder()->create($title, $createTableSchema);

            $schema = $connection->query()
                ->select('sql')
                ->from('sqlite_master')
                ->where('type', '=', 'table')
                ->where('name', $title)
                ->pluck('sql')
                ->first();

            $sqliteLibraryMeta = new SqliteLibraryMeta();
            $sqliteLibraryMeta->fill([
                'tbl_name' => $title,
                'schema' => $schema,
                'meta' => json_encode($fields, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ])->save();

            return $sqliteLibraryMeta;
        };

        return $connection->transaction($transactClosure);
    }

    public function exists(int $id): bool
    {
        return SqliteLibraryMeta::query()->where('id', $id)->exists();
    }

    public function getById(int $id): ?SqliteLibraryMeta
    {
        return SqliteLibraryMeta::query()->where('id', $id)->first();
    }

    public function deleteById(int $id): bool
    {
        if (!$this->exists($id)) {
            return true; // keeping idempotency
        }

        $libraryMeta = $this->getById($id);
        $connection = $libraryMeta->getConnection();

        $transactClosure = static function () use ($connection, $libraryMeta) {
            $connection->getSchemaBuilder()->dropIfExists($libraryMeta->tbl_name);
            $libraryMeta->delete();

            return true;
        };

        return $connection->transaction($transactClosure);
    }

    public function cleanUpById(int $id): int
    {
        $libraryMeta = $this->getById($id);
        $totalItems = $libraryMeta->getItemsCount();

        $libraryMeta->getConnection()->table($libraryMeta->tbl_name)->truncate();

        return $totalItems;
    }

    public function cacheItemsCount(int $id): int
    {
        $cacheKey = self::composeCacheKey(libraryId: $id);

        return Cache::remember($cacheKey, 60, static function () use ($id) {
            return SqliteLibraryMeta::getLibraryTableQuery(libraryId: $id)->count();
        });
    }

    public function resetCachedCount(int $id): void
    {
        $cacheKey = self::composeCacheKey(libraryId: $id);
        Cache::forget($cacheKey);
    }

    private static function composeCacheKey(int $libraryId): string
    {
        $userId = Auth::user()->id;

        return "items-count-$userId-$libraryId";
    }
}
