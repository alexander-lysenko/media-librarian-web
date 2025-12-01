<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Data Transfer Object for filter options.
 * It is used to filter items from a Library
 */
readonly class LibraryFilterDto
{
    /**
     * LibraryFilterDto
     */
    public function __construct(
        public int $libraryId,
        public ?string $sortAttribute,
        public string $sortDirection,
        public int $page,
        public int $perPage,
        public array $term,

    ) {}

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
