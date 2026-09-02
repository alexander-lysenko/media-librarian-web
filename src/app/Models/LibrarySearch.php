<?php

namespace App\Models;

use App\DTO\PaginationParamsDto;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * A Search model that implements simple filtering and sorting of Libraries
 */
class LibrarySearch
{
    public function __construct(public Builder $query) {}

    /**
     * The search payload method
     */
    public function search(PaginationParamsDto $pagination, string $filter = null): LengthAwarePaginator
    {
        $this->query = SqliteLibraryMeta::query()->select([
            'id' => 'id',
            'title' => 'tbl_name',
            'fields' => 'meta',
        ])->when(
            $filter,
            static fn(Builder $query) => $query->where('tbl_name', 'like', "%$filter%")
        )->when(
            $pagination->sortBy,
            static fn(Builder $query) => $query->orderBy($pagination->sortBy, $pagination->sortDirection)
        );

        return $this->query->paginate(perPage: $pagination->perPage, page: $pagination->page);
    }
}
