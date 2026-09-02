<?php

namespace App\Models;

use App\DTO\PaginationParamsDto;
use Illuminate\Database\Query\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * A Search model that implements complex filtering of Items from a particular Library
 */
class LibraryItemsSearch
{
    public function __construct(public Builder $query) {}

    /**
     * The search payload method
     */
    public function search(int $libraryId, PaginationParamsDto $pagination, array $terms = []): LengthAwarePaginator
    {
        $this->query = SqliteLibraryMeta::getLibraryTableQuery($libraryId);

        foreach ($terms as $column => $parameters) {
            $this->parseTerm($column, $parameters);
        }

        $this->query->when(
            $pagination->sortBy,
            static fn(Builder $query) => $query->orderBy($pagination->sortBy, $pagination->sortDirection)
        );

        return $this->query->paginate(perPage: $pagination->perPage, page: $pagination->page);
    }

    /**
     * Parses search term and converts it into query builder statements
     */
    private function parseTerm(string $column, array $parameters): void
    {
        if (count($parameters) < 2 || empty($parameters[1] ?? null)) {
            return;
        }

        [$option, $value, $value2] = [...$parameters, null];
        switch ($option) {
            case 'equalTo':
                $this->query->where($column, '=', $value);
                break;
            case 'notEqualTo':
                $this->query->where($column, '<>', $value);
                break;
            case 'contains':
                $this->query->where($column, 'like', "%$value%");
                break;
            case 'doesntContain':
                $this->query->where($column, 'not like', "%$value%");
                break;
            case 'startsWith':
                $this->query->where($column, 'like', "$value%");
                break;
            case 'endsWith':
                $this->query->where($column, 'like', "%$value");
                break;
            case 'greaterThan':
                $this->query->where($column, '>', $value);
                break;
            case 'lessThan':
                $this->query->where($column, '<', $value);
                break;
            case 'between':
                $this->query->whereBetween($column, [$value, $value2]);
                break;
            default:
                break;
        }
    }
}
