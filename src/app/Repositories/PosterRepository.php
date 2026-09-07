<?php

namespace App\Repositories;

use App\Models\Poster;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class PosterRepository
{
    public function __construct() {

    }

    public function getEntryById(string|int $id): ?Poster
    {
        return Poster::query()->where('uuid', $id)->first();
    }

    public function getEntry(int $libraryId, int $itemId): ?Poster
    {
        return Poster::query()
            ->where('user_id', Auth::user()->id)
            ->where('library_id', $libraryId)
            ->where('item_id', $itemId)
            ->first();
    }

    /**
     * @return Collection<string, Poster>
     */
    public function getMultipleEntries(int $libraryId, array $itemIds): Collection
    {
        return Poster::query()
            ->where('user_id', Auth::user()->id)
            ->where('library_id', $libraryId)
            ->whereIn('item_id', $itemIds)
            ->get();
    }
}
