<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryItemResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     * @var string|null
     */
    public static $wrap = 'entry';

    /**
     * Transform the resource into an array.
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        $resource = $this->resource;

        return get_object_vars($resource);
    }
}
