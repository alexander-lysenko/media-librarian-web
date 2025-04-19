<?php

namespace App\Http\Controllers\Api;

use App\Services\UnsplashApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Cache;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'unsplash', description: 'Unsplash API')]
class UnsplashApiController extends BaseController
{
    #[OA\Get(
        path: '/api/unsplash/image/{id}',
        operationId: 'get-unsplash-image',
        description: '',
        summary: 'Get Unsplash image by its ID',
        tags: ['unsplash'],
        parameters: [
            new OA\Parameter(parameter: 'id', name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'id', type: 'string', example: 'pXhwzz1JtQU'),
                    new OA\Property(
                        property: 'linkHtml',
                        type: 'string',
                        example: 'https://unsplash.com/photos/pXhwzz1JtQU'
                    ),
                    new OA\Property(
                        property: 'urlFull',
                        type: 'string',
                        example: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?'
                    ),
                    new OA\Property(
                        property: 'urlRegular',
                        type: 'string',
                        example: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=1080'
                    ),
                    new OA\Property(
                        property: 'urlSmall',
                        type: 'string',
                        example: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4&w=400'
                    ),
                    new OA\Property(property: 'author', type: 'string', example: 'John Smith', nullable: true),
                ])
            ),
        ]
    )]
    public function getImage(Request $request, UnsplashApiService $service): JsonResponse
    {
        $request->validate(['id' => ['string']]);
        $id = $request->route('id');

        $image = Cache::remember(
            key: "unsplash:image:$id",
            ttl: 86_400,
            callback: static fn() => $service->getImage($id)
        );

        return new JsonResponse(['image' => $image]);
    }

    #[OA\Get(
        path: '/api/unsplash/random',
        operationId: 'get-unsplash-random',
        description: '',
        summary: 'Get Unsplash random image',
        tags: ['unsplash'],
        parameters: [
            new OA\Parameter(
                parameter: 'topics',
                name: 'topics[]',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'array', items: new OA\Items(type: 'string'), example: ['movie', 'posters'])
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'id', type: 'string', example: 'pXhwzz1JtQU'),
                    new OA\Property(property: 'linkHtml',
                        type: 'string',
                        example: 'https://unsplash.com/photos/pXhwzz1JtQU'
                    ),
                    new OA\Property(
                        property: 'urlFull',
                        type: 'string',
                        example: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4'
                    ),
                    new OA\Property(
                        property: 'urlRegular',
                        type: 'string',
                        example: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=1080'
                    ),
                    new OA\Property(
                        property: 'urlSmall',
                        type: 'string',
                        example: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=400'
                    ),
                    new OA\Property(property: 'author', type: 'string', example: 'John Smith', nullable: true),
                ])
            ),
        ]
    )]
    public function randomImage(Request $request, UnsplashApiService $service): JsonResponse
    {
        $request->validate(['topics' => ['array'], 'topics.*' => 'string']);

        $topics = $request->input('topics');
        $topicsJoint = implode(',', $request->input('topics'));

        $images = Cache::remember(
            key: "unsplash:random:$topicsJoint",
            ttl: 3_600,
            callback: static fn() => $service->getRandomImages($topics)
        );

        return new JsonResponse(['image' => $images[array_rand($images)]]);
    }
}
