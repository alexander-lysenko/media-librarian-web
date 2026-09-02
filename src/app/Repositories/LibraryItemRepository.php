<?php

namespace App\Repositories;

use App\Models\SqliteLibraryMeta;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Random\RandomException;

class LibraryItemRepository
{
    public function __construct() {}

    public function exists(int $libraryId, int $itemId): bool
    {
        return self::getQuery($libraryId)->where('id', $itemId)->exists();
    }

    public function getById(int $libraryId, int $itemId): ?object
    {
        return self::getQuery($libraryId)->where('id', $itemId)->first();
    }

    public function getRandomItem(int $libraryId): ?object
    {
        $libraryRepository = app(LibraryRepository::class);
        $totalRows = $libraryRepository->cacheItemsCount($libraryId);

        try {
            $randomOffset = random_int(0, $totalRows - 1);
        } catch (RandomException $e) {
            Log::error($e);
            $randomOffset = rand(0, $totalRows - 1);
        }

        return self::getQuery($libraryId)->limit(1)->offset($randomOffset)->first();
    }

    public function createItemGetId(int $libraryId, array $contents): int
    {
        return self::getQuery($libraryId)->insertGetId($contents);
    }

    public function updateItem(int $libraryId, int $itemId, array $contents): int
    {
        return self::getQuery($libraryId)->where('id', $itemId)->update($contents);
    }

    public function deleteItem(int $libraryId, int $itemId): bool
    {
        return (bool)self::getQuery($libraryId)->where('id', $itemId)->delete();
    }

    public function resetCachedCount(int $libraryId): void
    {
        $cacheKey = $this->composeCacheKey($libraryId);
        Cache::forget($cacheKey);
    }

    private static function getQuery(int $libraryId): Builder
    {
        return SqliteLibraryMeta::getLibraryTableQuery($libraryId);
    }

    private function composeCacheKey(int $libraryId): string
    {
        $userId = Auth::user()->id;

        return "items-count-$userId-$libraryId";
    }
}
