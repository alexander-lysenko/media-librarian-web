<?php

namespace App\DTO;

/**
 * Data Transfer Object for Unsplash image metadata taken from Unsplash API
 *
 * @noinspection PhpClassCanBeReadonlyInspection
 */
class UnsplashImageDto
{
    public function __construct(
        public readonly string $id,
        public readonly string $linkHtml,
        public readonly string $urlFull,
        public readonly string $urlRegular,
        public readonly string $urlSmall,
        public readonly ?string $author = null,
    ) {}
}
