<?php

namespace App\Http\Controllers;

use App\Repositories\PosterRepository;
use App\Services\PosterCloudService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PosterController extends Controller
{
    public function __construct(
        private readonly PosterRepository $posterRepository,
        private readonly PosterCloudService $posterCloudService,
    ) {}

    public function generateCloudUrl(Request $request): ?string
    {
        $request->merge(['uuid' => $request->route('uuid')]);
        $request->validate(['uuid' => ['required', 'uuid']]);
        $poster = $this->posterRepository->getEntryById($request->uuid);

        $route = $this->posterCloudService->getSignedUrl(libraryId: $poster->library_id, itemId: $poster->item_id)
            ?: $this->posterCloudService->tmpSignedUrl(uuid: $request->uuid);

        return new RedirectResponse(url: $route ?: '/404');
    }
}
