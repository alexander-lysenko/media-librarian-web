<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

readonly class PaginationParamsDto
{
    public function __construct(
        public int $page = 1,
        public int $perPage = 20,
        public ?string $sortBy,
        public ?string $sortDirection,
    ){}

    public static function fromRequest(FormRequest $request): PaginationParamsDto
    {
        return new self(
            page: $request->input('page', 1),
            perPage: $request->input('perPage', 25),
            sortBy: $request->input('sort.attribute'),
            sortDirection: $request->input('sort.direction', 'asc'),
        );
    }
}
