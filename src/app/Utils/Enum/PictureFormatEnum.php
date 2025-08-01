<?php

namespace App\Utils\Enum;

enum PictureFormatEnum: string
{
    case JPEG = 'jpeg';
    case PNG = 'png';
    case BMP = 'BMP';
    case WEBP = 'webp';

    public function isCloudSuitable(): bool
    {
        return match ($this->value) {
            self::WEBP->value => true,
            default => false,
        };
    }
}
