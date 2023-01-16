<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\CollectionEntryRequest;
use App\Http\Requests\V1\CollectionIdRequest;
use App\Http\Requests\V1\CreateCollectionEntryRequest;
use App\Models\SqliteCollectionMeta;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'entries', description: 'Manage the entries of a collection')]
#[OA\Schema(schema: 'CollectionEntryExample',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'Movie Title', type: 'string', example: 'Лицо со шрамом'),
        new OA\Property(property: 'Origin Title', type: 'string', example: 'Scarface'),
        new OA\Property(property: 'Release Date', type: 'string', example: '1983-12-01'),
        new OA\Property(
            property: 'Description',
            type: 'text',
            example: 'In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.'
        ),
        new OA\Property(property: 'IMDB URL', type: 'string', example: 'https://www.imdb.com/title/tt0086250/'),
        new OA\Property(property: 'IMDB Rating', type: 'integer', example: 8),
        new OA\Property(property: 'My Rating', type: 'integer', example: 5),
        new OA\Property(property: 'Watched', type: 'boolean', example: true),
        new OA\Property(property: 'Watched At', type: 'string', example: '2020-01-01 00:00:01'),
        new OA\Property(property: 'Chance to Advice', type: 'integer', example: 5),
    ]
)]
/**
 * Collection entries controller - CRUD actions for the entries in the selected collection
 */
class CollectionEntryController extends ApiV1Controller
{
    #[OA\Get(
        path: '/api/v1/collections/{id}/entries',
        description: 'View all entries from the specified collection. By default the selection is paginated. ' .
        'The selection can be filtered by any of collection fields using customizable search rules.',
        summary: 'View All/Filtered Entries of a Collection',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['entries'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF),
            new OA\Parameter(ref: self::PARAM_PAGE_REF),
            new OA\Parameter(ref: self::PARAM_PER_PAGE_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(
                        property: 'entries',
                        type: 'array',
                        items: new OA\Items(ref: self::SCHEMA_COLLECTION_ENTRY_REF)
                    ),
                    new OA\Property(property: 'pagination', properties: [
                        new OA\Property(property: 'currentPage', type: 'integer', example: 1),
                        new OA\Property(property: 'lastPage', type: 'integer', example: 15),
                        new OA\Property(property: 'perPage', type: 'integer', example: 20),
                        new OA\Property(property: 'total', type: 'integer', example: 299),
                    ]),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param CollectionIdRequest $request
     * @return JsonResponse
     */
    public function index(CollectionIdRequest $request): JsonResponse
    {
        // Todo: Add search model, filtering, sorting
        $paginatedResource = $this
            ->getCollectionTableQuery($request->id)
            ->paginate(perPage: $request->get('perPage'), page: $request->get('page'));

        $pagination = [
            'currentPage' => $paginatedResource->currentPage(),
            'lastPage' => $paginatedResource->lastPage(),
            'perPage' => $paginatedResource->perPage(),
            'total' => $paginatedResource->total(),
        ];

        $resource = new JsonResource($paginatedResource->items());
        $resource::wrap('entries');
        $resource->with['pagination'] = $pagination;

        return $resource->response();
    }

    #[OA\Post(
        path: '/api/v1/collections/{id}/entries',
        description: 'Create a new entry into the specified collection.' .
        ' The structure of the new entry must match the structure of the collection that a new entry is created into.',
        summary: 'Add a new entry',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'contents', properties: [
                    new OA\Property(property: 'Movie Title', type: 'string', example: 'Лицо со шрамом'),
                    new OA\Property(property: 'Origin Title', type: 'string', example: 'Scarface'),
                    new OA\Property(property: 'Release Date', type: 'string', example: '1983-12-01'),
                    new OA\Property (
                        property: 'Description',
                        type: 'text',
                        example: 'In 1980 Miami, a determined Cuban immigrant takes over a drug cartel ' .
                        'and succumbs to greed.'
                    ),
                    new OA\Property(
                        property: 'IMDB URL',
                        type: 'string',
                        example: 'https://www.imdb.com/title/tt0086250/'
                    ),
                    new OA\Property(property: 'IMDB Rating', type: 'integer', example: 8),
                    new OA\Property(property: 'My Rating', type: 'integer', example: 5),
                    new OA\Property(property: 'Watched', type: 'boolean', example: true),
                    new OA\Property(property: 'Watched At', type: 'string', example: '2020-01-01 00:00:01'),
                    new OA\Property(property: 'Chance to Advice', type: 'integer', example: '5'),
                ]),
            ])
        ),
        tags: ['entries'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CreateCollectionEntryRequest $request
     * @return JsonResponse
     */
    public function create(CreateCollectionEntryRequest $request): JsonResponse
    {
        $contents = $request->contents;
        $id = $this->getCollectionTableQuery($request->id)->insertGetId($contents);
        // todo: implement file uploading

        $response = array_merge(['id' => $id], $contents);
        $resource = new JsonResource($response);
        $resource::wrap('entry');

        return $resource->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/v1/collections/{id}/entries/{entry}',
        description: 'Find an entry by its ID in the specified collection.',
        summary: 'View/Open an entry',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['entries'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF),
            new OA\Parameter(ref: self::PARAM_ENTRY_ID_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'WIP',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param CollectionEntryRequest $request
     * @return void
     */
    public function view(CollectionEntryRequest $request)
    {
    }

    #[OA\Put(path: '/api/v1/collections/{id}/entries/{entry}',
        description: 'Update an entry by its ID in the specified collection.',
        summary: 'Update an entry',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'contents', properties: [
                    new OA\Property(property: 'Movie Title', type: 'string', example: 'Лицо со шрамом'),
                    new OA\Property(property: 'Origin Title', type: 'string', example: 'Scarface'),
                    new OA\Property(property: 'Release Date', type: 'string', example: '1983-12-01'),
                    new OA\Property (
                        property: 'Description',
                        type: 'text',
                        example: 'In 1980 Miami, a determined Cuban immigrant takes over a drug cartel ' .
                        'and succumbs to greed.'
                    ),
                    new OA\Property(
                        property: 'IMDB URL',
                        type: 'string',
                        example: 'https://www.imdb.com/title/tt0086250/'
                    ),
                    new OA\Property(property: 'IMDB Rating', type: 'integer', example: 8),
                    new OA\Property(property: 'My Rating', type: 'integer', example: 5),
                    new OA\Property(property: 'Watched', type: 'boolean', example: true),
                    new OA\Property(property: 'Watched At', type: 'string', example: '2020-01-01 00:00:01'),
                    new OA\Property(property: 'Chance to Advice', type: 'integer', example: '5'),
                ], type: 'object'),
            ])
        ),
        tags: ['entries'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF),
            new OA\Parameter(ref: self::PARAM_ENTRY_ID_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'WIP',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CreateCollectionEntryRequest $request
     * @return void
     */
    public function update(CreateCollectionEntryRequest $request)
    {
    }

    #[OA\Delete(
        path: '/api/v1/collections/{id}/entries/{entry}',
        description: 'Delete/Erase an entry by its ID from the specified collection.',
        summary: 'Delete an entry',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['entries'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF),
            new OA\Parameter(ref: self::PARAM_ENTRY_ID_REF),
        ],

        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CollectionEntryRequest $request
     * @return JsonResponse
     */
    public function delete(CollectionEntryRequest $request): JsonResponse
    {
        $id = $this->getCollectionTableQuery($request->id)->delete($request->entry);
        return new JsonResponse(null, 204);
    }

    #[OA\Get(
        path: '/api/v1/collections/{id}/entries/random',
        description: 'Find any random entry in the specified collection.',
        summary: 'Get a random entry',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['entries'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
        responses: [
            new OA\Response(
                response: 200,
                description: 'WIP',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CollectionIdRequest $request
     * @return JsonResponse
     */
    public function random(CollectionIdRequest $request): JsonResponse
    {
        // todo: find the best solution to get random entry
        $resource = new JsonResource([]);
        $resource::wrap('entry');

        return $resource->response();
    }

    /**
     * Composes a query builder starting from a collection table found by its ID.
     * @param int $id - the collection ID from SqliteCollectionMeta
     * @return Builder - an Illuminate\Database\Query\Builder instance
     */
    private function getCollectionTableQuery(int $id): Builder
    {
        /** @var SqliteCollectionMeta $sqliteCollectionMeta */
        $sqliteCollectionMeta = SqliteCollectionMeta::query()->where('id', '=', $id)->first();

        return $sqliteCollectionMeta->getConnection()->table($sqliteCollectionMeta->tbl_name);
    }
}
