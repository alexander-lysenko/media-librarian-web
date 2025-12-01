<?php

namespace App\Repositories;

use App\Models\SqliteLibraryMeta;
use Illuminate\Database\Query\Builder;

class LibraryItemRepository
{
    public function __construct() {}

    public function itemExists(int $libraryId, int $itemId): bool
    {
        return self::getQuery($libraryId)->where('id', $itemId)->exists();
    }

    public function getItemById(int $libraryId, int $itemId): ?object
    {
        return self::getQuery($libraryId)->where('id', $itemId)->first();
    }

    public function insertItem(int $libraryId, array $contents): int
    {
        return self::getQuery($libraryId)->insertGetId($contents);
    }

    public function updateItem(int $libraryId, int $itemId, array $contents): int
    {
        return self::getQuery($libraryId)->where('id', $itemId)->update($contents);
    }

    public function deleteItemById(int $libraryId, int $itemId): bool
    {
        return (bool)self::getQuery($libraryId)->where('id', $itemId)->delete();
    }

    private static function getQuery(int $libraryId): Builder
    {
        return SqliteLibraryMeta::getLibraryTableQuery($libraryId);
    }
}
