<?php

namespace App\Repositories;

use App\Models\Poster;
use Illuminate\Support\Facades\Auth;

class PosterRepository
{
    public function __construct() {

    }

    public function getPosterEntry(int $libraryId, int $itemId): ?Poster
    {
        return Poster::query()
            ->where('user_id', Auth::user()->id)
            ->where('library_id', $libraryId)
            ->where('item_id', $itemId)
            ->first();
    }

    /**
     * @return Poster[]
     */
    public function getPosterEntries(int $libraryId, array $itemIds): array
    {
        return Poster::query()
            ->where('user_id', Auth::user()->id)
            ->where('library_id', $libraryId)
            ->whereIn('item_id', $itemIds)
            ->get()
            ->toArray();

    }
}
