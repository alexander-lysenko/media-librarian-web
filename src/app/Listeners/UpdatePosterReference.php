<?php

namespace App\Listeners;

use App\Events\PosterUpdated;
use App\Models\Poster;
use App\Services\PosterCloudService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Throwable;

class UpdatePosterReference implements ShouldQueue
{
    /**
     * @var PosterUpdated
     */
    private PosterUpdated $eventData;

    /**
     * Create the event listener.
     */
    public function __construct(private readonly PosterCloudService $posterCloudService) {}

    public function handle(PosterUpdated $event): void
    {
        $this->eventData = $event;
    }

    public function failed(PosterUpdated $event, Throwable $throwable): void
    {
        Log::error($throwable->getMessage(), compact('event', 'throwable'));
    }

    private function getPosterCatalogEntry(): ?Poster
    {
        return Poster::query()
            ->where('user_id', $this->eventData->getUserId())
            ->where('library_id', $this->eventData->getLibraryId())
            ->where('item_id', $this->eventData->getLibraryItemId())
            ->first();
    }

    private function deleteOldPoster() {
        $this->posterCloudService->delete();
    }

    private function placeNewPoster() {
        $this->posterCloudService->upload();
    }
}
