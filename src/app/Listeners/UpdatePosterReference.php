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
    private PosterUpdated $eventData;

    /**
     * Create the event listener.
     */
    public function __construct(private readonly PosterCloudService $posterCloudService) {}

    public function handle(PosterUpdated $event): void
    {
        $this->eventData = $event;
        $newPosterId = $this->eventData->getNewPosterId();
        $oldPosterId = $this->eventData->getOldPosterId();

        match (true) {
            $oldPosterId && !$newPosterId => $this->deleteOldPoster(),
            !$oldPosterId && $newPosterId => $this->placeNewPoster(),
            $newPosterId && $oldPosterId && $newPosterId !== $oldPosterId => $this->updatePoster(),
            default => false,
        };
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

    private function createPosterCatalogEntry(): Poster
    {
        return new Poster([
            'user_id' => $this->eventData->getUserId(),
            'library_id' => $this->eventData->getLibraryId(),
            'item_id' => $this->eventData->getLibraryItemId(),
        ]);
    }

    private function deleteOldPoster(): void
    {
        $this->posterCloudService->delete();

        $this->getPosterCatalogEntry()?->delete();
    }

    private function placeNewPoster(): void
    {
        $this->posterCloudService->rename();

        $poster = $this->createPosterCatalogEntry();
        $poster->setAttribute('id', $this->eventData->getNewPosterId());
        $poster->save();
    }

    private function updatePoster(): void
    {
        $this->posterCloudService->rename();

        $poster = $this->getPosterCatalogEntry();
        if ($poster !== null) {
            $poster->setAttribute('id', $this->eventData->getNewPosterId());
            $poster->save();
        }
    }
}
