<?php

namespace App\DTO;

/**
 * Data Transfer Object for Unsplash image metadata taken from Unsplash API
 */
readonly class UnsplashImageDto
{
    public function __construct(
        public string $id,
        public string $linkHtml,
        public string $urlFull,
        public string $urlRegular,
        public string $urlSmall,
        public ?string $author = null,
    ) {}
}
