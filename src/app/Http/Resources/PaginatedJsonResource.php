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

        $this->with['pagination'] = [
            'currentPage' => $paginatedResource->currentPage(),
            'lastPage' => $paginatedResource->lastPage(),
            'perPage' => $paginatedResource->perPage(),
            'total' => $paginatedResource->total(),
        ];
    }
}
