<?php

namespace App\Services;

use App\Utils\Enum\PictureFormatEnum;
use Error;
use GdImage;

/**
 * Service for processing images, providing functionality such as conversion between formats,
 * rescaling to specified dimensions, and exporting to supported formats.
 */
class ImageProcessingService
{
    // Maximum resolution is 720x1280 as portrait, 1280x720 as landscape, 1280x1280 as square
    private const MAX_DIMENSION_PIXELS = 1280;

    private GdImage $image;

    public function __construct() {}

    /**
     * Converts the given image content to the specified format and optionally rescales it.
     * The image resolution is set to 150 DPI during the conversion process.
     *
     * @param string $contents The raw image data as a string.
     * @param PictureFormatEnum $format The desired output image format.
     * @param bool $rescale Whether to rescale the image before conversion. Defaults to true.
     * @return string The converted image data as a string.
     * @throws Error If the specified format is not supported.
     */
    public function convert(string $contents, PictureFormatEnum $format, bool $rescale = true): string
    {
        $this->image = imagecreatefromstring(data: $contents);
        imageresolution(image: $this->image, resolution_x: 150, resolution_y: 150);

        if ($rescale) {
            $this->downscale();
        }

        return match ($format) {
            PictureFormatEnum::WEBP => $this->exportToWebp(),
            PictureFormatEnum::PNG => $this->exportToPng(),
            PictureFormatEnum::JPEG => $this->exportToJpg(),
            default => throw new Error(message: "Format {$format->value} not supported"),
        };
    }

    /**
     * Downscales the current image resource if its dimensions exceed the defined maximum pixel dimension.
     * Rescaling is performed proportionally to ensure the image fits within the maximum dimension.
     * The image resource is modified in-place with the resized version.
     *
     * @return void
     */
    private function downscale(): void
    {
        $width = imagesx(image: $this->image);
        $height = imagesy(image: $this->image);

        if (max($width, $height) > self::MAX_DIMENSION_PIXELS) {
            // Scale factor is usually more than 1.00
            $scaleFactor = max($width, $height) / self::MAX_DIMENSION_PIXELS;

            $this->image = imagescale(
                image: $this->image,
                width: round(num: $width / $scaleFactor),
                height: round(num: $height / $scaleFactor)
            );
        }
    }

    /**
     * Converts the current image resource to the WebP format and returns the resulting data as a string.
     * The image is not saved to a file, and the WebP data is instead captured in output buffering.
     *
     * @return string|false The WebP image data as a string on success, or false on failure.
     */
    private function exportToWebp(): string|false
    {
        ob_start();
        imagewebp(image: $this->image, file: null, quality: 85);

        return ob_get_clean();
    }

    /**
     * Exports the current image resource to a PNG format.
     * Captures the generated image output as a string.
     *
     * @return string|false Returns the PNG image data as a string on success, or false on failure.
     */
    private function exportToPng(): string|false
    {
        ob_start();
        imagepng(image: $this->image, file: null, quality: 90);

        return ob_get_clean();
    }

    /**
     * Exports the current image resource to a JPG format.
     * Captures the generated image output as a string.
     *
     * @return string|false Returns the JPG image data as a string on success, or false on failure.
     */
    private function exportToJpg(): string|false
    {
        ob_start();
        imagejpeg(image: $this->image, file: null, quality: 85);

        return ob_get_clean();
    }
}
