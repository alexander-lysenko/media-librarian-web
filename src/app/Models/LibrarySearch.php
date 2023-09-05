<?php

namespace App\Models;

use App\DTO\LibraryFilterDTO;
use Illuminate\Database\Query\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * A Search model to implement complex filtering of items from a Library
 */
class LibrarySearch
{
    /**
     * LibrarySearch constructor
     */
    public function __construct(public Builder $query)
    {
    }

    /**
     * The search payload method
     * @param LibraryFilterDTO $filter
     * @return LengthAwarePaginator
     */
    public function search(LibraryFilterDTO $filter): LengthAwarePaginator
    {
        $this->query = SqliteLibraryMeta::getLibraryTableQuery($filter->libraryId);
        foreach ($filter->term as $column => $parameters) {
            $this->parseTerm($column, $parameters);
        }

        $this->query->when(
            $filter->sortAttribute,
            static fn(Builder $query) => $query->orderBy($filter->sortAttribute, $filter->sortDirection)
        );

        return $this->query->paginate(perPage: $filter->perPage, page: $filter->page);
    }

    /**
     * @param string $column
     * @param array $parameters
     * @return void
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
