<?php

namespace App\Http\Controllers\Api;

use App\Services\UnsplashApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
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
            new OA\Parameter(
                parameter: 'collections',
                name: 'collections[]',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'array', items: new OA\Items(type: 'string'), example: ['movies'])
            ),
            new OA\Parameter(
                parameter: 'query',
                name: 'query',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'array', items: new OA\Items(type: 'string'), example: 'studio camera')
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
        $request->validate([
            'query' => ['string'],
            'topics' => ['array'],
            'topics.*' => 'string',
            'collections' => ['array'],
            'collections.*' => 'string',
        ]);

        $filters = [];
        $requestPrint = [];
        if ($request->has('topics') && !$request->has('query')) {
            $filters['topics'] = $request->input('topics');
            $requestPrint[] = implode(',', $request->input('topics'));
        }
        if ($request->has('collections')&& !$request->has('query')) {
            $filters['collections'] = $request->input('collections');
            $requestPrint[] = implode(',', $request->input('collections'));
        }
        if ($request->has('query')) {
            $filters['query'] = $request->input('query');
            $requestPrint[] = $request->input('query');
        }

        $cacheKey = Hash::make(implode(':', $requestPrint));

        $images = Cache::remember(
            key: "unsplash:random:$cacheKey",
            ttl: 3_600,
            callback: static fn() => $service->getRandomImages($filters)
        );

        return new JsonResponse(['image' => $images[array_rand($images)]]);
    }
}
