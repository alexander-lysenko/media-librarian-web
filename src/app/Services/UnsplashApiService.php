<?php

namespace App\Services;

use App\DTO\UnsplashImageDto;
use Unsplash\HttpClient as UnsplashHttpClient;
use Unsplash\Photo;

/**
 * A Service that is a configurator and wrapper for Unsplash API.
 */
class UnsplashApiService
{
    public function __construct()
    {
        UnsplashHttpClient::init([
            'callbackUrl' => 'urn:ietf:wg:oauth:2.0:oob',
            'applicationId' => env('UNSPLASH_ACCESS_KEY'),
            'secret' => env('UNSPLASH_APPLICATION_SECRET'),
            'utmSource' => env('UNSPLASH_APPLICATION_NAME'),
        ]);
    }

    /**
     * @param array $topics
     * @param int $count
     * @return array<UnsplashImageDto>
     * @see https://unsplash.com/documentation#get-a-random-photo
     */
    public function getRandomImages(array $topics, int $count = 30): array
    {
        $photos = Photo::random([
            'orientation' => 'landscape',
            'count' => $count,
            'topics' => implode(',', $topics),
        ]);

        return array_map(static fn($photo) => new UnsplashImageDto(
            id: $photo['id'],
            linkHtml: $photo['links']['html'],
            urlFull: $photo['urls']['full'],
            urlRegular: $photo['urls']['regular'],
            urlSmall: $photo['urls']['small'],
            author: $photo['user']['name']
        ), $photos->toArray());
    }

    /**
     * @param string $id
     * @return UnsplashImageDto
     * @see https://unsplash.com/documentation#get-a-photo
     */
    public function getImage(string $id): UnsplashImageDto
    {
        $photo = Photo::find($id)->toArray();

        return new UnsplashImageDto(
            id: $photo['id'],
            linkHtml: $photo['links']['html'],
            urlFull: $photo['urls']['full'],
            urlRegular: $photo['urls']['regular'],
            urlSmall: $photo['urls']['small'],
            author: $photo['user']['name']
        );
    }
}
