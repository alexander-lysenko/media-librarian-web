<?php

namespace App\Jobs;

use App\Models\Poster;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

/**
 * A background job to upload posters into a dedicated storage
 */
class PosterUploadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Maximum resolution is 720x1280 as portrait
    private const MAX_DIMENSION_PIXELS = 1280;

    /**
     * Create a new job instance.
     * @return void
     */
    public function __construct(
        private readonly int $userId,
        private readonly int $collectionId,
        private readonly int $entryId,
        private readonly string $poster,
    ) {
    }

    /**
     * Execute the job.
     * @return void
     */
    public function handle(): void
    {
        // Prepare file contents
        $posterContents = explode('base64,', $this->poster)[1];
        $tmpFile = tmpfile();
        $tmpFilePath = stream_get_meta_data($tmpFile)['uri'];

        // Process image using GD extension
        $gdImage = imagecreatefromstring(base64_decode($posterContents));
        $width = imagesx($gdImage);
        $height = imagesy($gdImage);
        if (max($width, $height) > self::MAX_DIMENSION_PIXELS) {
            $scaleFactor = self::MAX_DIMENSION_PIXELS / (max($width, $height) ?: self::MAX_DIMENSION_PIXELS);
            $gdImage = imagescale($gdImage, $width / $scaleFactor);
        }
        imagepng($gdImage, $tmpFilePath, 8);

        // Compose file path
        $fileName = hash('crc32b', $posterContents);
        $filePath = "$this->userId/$this->collectionId/$this->entryId/$fileName.png";

        // Upload file to S3
        if (Storage::disk('s3')->put($filePath, $tmpFile)) {
            // Save a record into database
            $posterEntry = new Poster([
                'user_id' => $this->userId,
                'collection_id' => $this->collectionId,
                'entry_id' => $this->entryId,
                'uri' => $filePath,
            ]);
            $posterEntry->save();
            unlink($tmpFilePath);
        } else {
            $this->fail("An error occurred during saving file $filePath");
        }
    }
}
