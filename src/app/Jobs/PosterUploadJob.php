<?php

namespace App\Jobs;

use App\Models\Poster;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
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
        Log::info("Source image dimensions: $width x $height");

        if (max($width, $height) > self::MAX_DIMENSION_PIXELS) {
            Log::info('Image is larger than expected, downscale is required');
            // Scale factor is usually more than 1.00
            $scaleFactor = max($width, $height) / self::MAX_DIMENSION_PIXELS;
            Log::info("Scale Factor: $scaleFactor");
            $gdImage = imagescale(
                image: $gdImage,
                width: round($width / $scaleFactor),
                height: round($height / $scaleFactor)
            );

            $width = imagesx($gdImage);
            $height = imagesy($gdImage);
            Log::info("Resized image dimensions: $width x $height");
        } else {
            Log::info("Keep original image dimensions: $width x $height");
        }

        // Export image into WEBP
        imagewebp($gdImage, $tmpFilePath, 90);

        // Compose file path
        $fileName = hash_file('crc32b', $tmpFilePath);
        $filePath = implode('/', [
            "user_$this->userId",
            "collection_$this->collectionId",
            "$this->entryId-$fileName.webp",
        ]);

        // Upload file to S3 // todo: replace 'local' with 's3'
        if (Storage::disk('local')->put($filePath, $tmpFile)) {
            Log::info("File saved successfully: $filePath");
            // Save a record into database
            $posterEntry = Poster::query()->firstOrNew([
                'user_id' => $this->userId,
                'collection_id' => $this->collectionId,
                'entry_id' => $this->entryId,
            ], [
                'uri' => $filePath,
            ]);
            $posterEntry->updateTimestamps();
            $posterEntry->save();
            Log::info('Recording an entry about the uploaded file...');
            imagedestroy($gdImage);
            unlink($tmpFilePath);
        } else {
            $this->fail("An error occurred during saving file $filePath");
        }
    }
}
