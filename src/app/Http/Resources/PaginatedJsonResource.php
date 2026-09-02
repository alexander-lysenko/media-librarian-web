<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Custom paginated JsonResource that includes paginated items and overridden pagination metadata
 */
class PaginatedJsonResource extends JsonResource
{
    public function __construct(LengthAwarePaginator $paginatedResource)
    {
        parent::__construct($paginatedResource->items());

        $this::wrap('items');
        $this->withPagination($paginatedResource);
    }

    public function withPagination(LengthAwarePaginator $paginatedResource): static
    {
        $this->with['pagination'] = [
            'currentPage' => $paginatedResource->currentPage(),
            'lastPage' => $paginatedResource->lastPage(),
            'perPage' => $paginatedResource->perPage(),
            'total' => $paginatedResource->total(),
        ];

        return $this;
    }

    public function withSort(?string $attribute, ?string $direction): static
    {
        if (is_null($attribute) || is_null($direction)) {
            return $this;
        }

        $this->with['sort'] = [
            'attribute' => $attribute,
            'direction' => $direction,
        ];

        return $this;
    }
}
