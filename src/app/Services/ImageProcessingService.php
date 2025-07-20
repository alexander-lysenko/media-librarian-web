<?php

namespace App\Services;

use GdImage;

class ImageProcessingService
{
    // Maximum resolution is 720x1280 as portrait, 1280x720 as landscape, 1280x1280 as square
    private const MAX_DIMENSION_PIXELS = 1280;

    private GdImage $image;

    public function __construct() {}

    public function processFromSource(string $contents): string
    {
        $this->image = imagecreatefromstring($contents);
        $this->downscale();

        return $this->exportToWebp();
    }

    private function downscale(): void
    {
        $width = imagesx($this->image);
        $height = imagesy($this->image);

        if (max($width, $height) > self::MAX_DIMENSION_PIXELS) {
            // Scale factor is usually more than 1.00
            $scaleFactor = max($width, $height) / self::MAX_DIMENSION_PIXELS;

            $this->image = imagescale(
                image: $this->image,
                width: round($width / $scaleFactor),
                height: round($height / $scaleFactor)
            );
        }
    }

    private function exportToWebp(): string|false
    {
        ob_start();
        imagewebp(image: $this->image, file: null, quality: 90);

        return ob_get_clean();
    }
}
