<?php

namespace App\Services;

use App\Utils\Enum\PictureFormatEnum;
use Closure;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

/**
 *
 */
class PosterCloudService
{
    public function __construct() {}

    public function upload(UploadedFile $file, string $path, string $disk): void
    {
        $storedFilePath = Storage::disk(name: $disk)->putFileAs(path: $path, file: $file);

        if (empty($storedFilePath)) {
            throw new FileException('Rejected to upload the file.');
        }
    }

    public static function loadFrom(string $path, string $disk): self
    {
        $file = UploadedFile::fake()->create(sys_get_temp_dir());
        $contents = Storage::disk($disk)->get($path);

        if (empty($contents)) {
            throw new FileException('Unable to get file contents.');
        }
        file_put_contents($file->getRealPath(), $contents);

        return new self($file);
    }

    public function rename() {}

    public function delete() {}

    public function createUrl(): string
    {
        return '';
    }

    public function tmpUrl(int $libraryId, int $itemId): ?string
    {
        // todo: add poster path resolving, handle case when poster is not found

        return Storage::disk('r2')->temporaryUrl(
            path: 'Hotline Miami - Lamborghini (20250417112906).jpg',
            expiration: now()->addSeconds(60)
        );
    }

    public function tmpUrlByUuid(string $uuid): string
    {
        return Storage::disk('r2')->temporaryUrl(
            path: 'Hotline Miami - Lamborghini (20250417112906).jpg',
            expiration: now()->addSeconds(60)
        );
    }
}
