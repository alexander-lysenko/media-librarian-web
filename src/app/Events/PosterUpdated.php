<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PosterUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        private readonly int $userId,
        private readonly int $libraryId,
        private readonly int $libraryItemId,
        private readonly ?string $oldPosterId,
        private readonly ?string $newPosterId,
    ) {}

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getLibraryId(): int
    {
        return $this->libraryId;
    }

    public function getLibraryItemId(): int
    {
        return $this->libraryItemId;
    }

    public function getOldPosterId(): ?string
    {
        return $this->oldPosterId;
    }

    public function getNewPosterId(): ?string
    {
        return $this->newPosterId;
    }
}
