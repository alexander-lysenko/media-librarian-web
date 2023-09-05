<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Data Transfer Object for filter options.
 * It is used to filter items from a Library
 */
class LibraryFilterDTO
{
    /**
     * LibraryFilterDTO
     */
    public function __construct(
        public readonly int $libraryId,
        public readonly ?string $sortAttribute,
        public readonly string $sortDirection,
        public readonly int $page,
        public readonly int $perPage,
        public readonly array $term,

    ) {
    }

    /**
     * @param FormRequest $request
     * @return self
     */
    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            libraryId: $request->input('id'),
            sortAttribute: $request->input('sort.attribute'),
            sortDirection: $request->input('sort.direction', 'asc'),
            page: $request->input('page', 1),
            perPage: $request->input('perPage', 25),
            term: $request->input('term', [])
        );
    }
}
