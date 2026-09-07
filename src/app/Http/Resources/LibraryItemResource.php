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
    public static $wrap = 'item';

    /**
     * Transform the resource into an array.
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        $resource = $this->resource;

        return is_object($resource) ? get_object_vars($resource) : $resource;
    }

    public function withPoster(?string $poster): void
    {
        if (!empty($poster)) {
            $this->with['poster'] = $poster;
        }
    }
}
