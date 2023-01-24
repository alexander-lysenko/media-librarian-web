<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\CollectionEntryCreateRequest;
use App\Http\Requests\V1\CollectionEntryRequest;
use App\Http\Requests\V1\CollectionEntryUpdateRequest;
use App\Http\Requests\V1\CollectionIdRequest;
use App\Http\Resources\CollectionEntryResource;
use App\Models\SqliteCollectionMeta;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'entries', description: 'Manage the entries of a collection')]
#[OA\Schema(
    schema: 'CollectionEntryExample',
    description: '',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'Movie Title', type: 'string', example: 'Лицо со шрамом (1983)'),
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
), OA\Schema(
    schema: 'CollectionEntryRequestExample',
    description: 'Collection entry request example',
    properties: [
        new OA\Property(property: 'Movie Title', example: 'Лицо со шрамом (1983)'),
        new OA\Property(property: 'Origin Title', example: 'Scarface'),
        new OA\Property(property: 'Release Date', example: '1983-12-01'),
        new OA\Property(
            property: 'Description',
            example: 'In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.'
        ),
        new OA\Property(property: 'IMDB URL', example: 'https://www.imdb.com/title/tt0086250/'),
        new OA\Property(property: 'IMDB Rating', example: 8),
        new OA\Property(property: 'My Rating', example: 5),
        new OA\Property(property: 'Watched', example: true),
        new OA\Property(property: 'Watched At', example: '2020-01-01 00:00:01'),
        new OA\Property(property: 'Chance to Advice', example: 5),
    ],
)]
/**
 * Collection entries controller - CRUD actions for the entries in the selected collection
 */
class CollectionEntryController extends ApiV1Controller
{
    #[OA\Get(
        path: '/api/v1/collections/{id}/entries',
        description: "View all entries from the specified collection.\n\n" .
        'By default the selection is paginated. ' .
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
        $paginatedResource = SqliteCollectionMeta::getCollectionTableQuery($request->id)
            ->paginate(perPage: $request->get('perPage'), page: $request->get('page'));

        $pagination = [
            'currentPage' => $paginatedResource->currentPage(),
            'lastPage' => $paginatedResource->lastPage(),
            'perPage' => $paginatedResource->perPage(),
            'total' => $paginatedResource->total(),
        ];

        // TODO: replace with CollectionPaginatedResource
        $resource = new JsonResource($paginatedResource->items());
        $resource::wrap('entries');
        $resource->with['pagination'] = $pagination;

        return $resource->response();
    }

    #[OA\Post(
        path: '/api/v1/collections/{id}/entries',
        description: "Create a new entry into the specified collection.\n\n" .
        ' The structure of the new entry must match the structure of the collection that a new entry is created into.',
        summary: 'Add a New Entry',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: [
                new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(properties: [
                    new OA\Property(property: 'contents', ref: self::SCHEMA_COLLECTION_ENTRY_REQUEST_REF),
                    new OA\Property(
                        property: 'poster',
                        description: 'Attach a poster (binary file)',
                        type: 'string',
                        format: 'binary'
                    ),
                ])),
                new OA\JsonContent(properties: [
                    new OA\Property(property: 'contents', ref: self::SCHEMA_COLLECTION_ENTRY_REQUEST_REF),
                    new OA\Property(
                        property: 'poster',
                        description: "Attach a poster (in Base64 string format).\n\n" .
                        'To convert an image into base64 (for development purposes), ' .
                        'you can use this service: https://www.base64-image.de/',
                        type: 'string',
                        format: 'base64',
                        example: null
                    ),
                ]),
            ]
        ),
        tags: ['entries'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: null),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CollectionEntryCreateRequest $request
     * @return JsonResponse
     */
    public function create(CollectionEntryCreateRequest $request): JsonResponse
    {
        $contents = $request->contents;
        $id = SqliteCollectionMeta::getCollectionTableQuery($request->id)->insertGetId($contents);
        // todo: implement file uploading

        $response = array_merge(['id' => $id], $contents);
        $resource = new JsonResource($response);
        $resource::wrap('entry');

        // todo: upload poster and return its URL
        $resource->with['poster'] = null;
        return $resource->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/v1/collections/{id}/entries/{entry}',
        description: 'Find an entry by its ID in the specified collection.',
        summary: 'View/Open an Entry',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['entries'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF),
            new OA\Parameter(ref: self::PARAM_ENTRY_ID_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: 'https://localhost/1.jpg'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param CollectionEntryRequest $request
     * @return JsonResponse
     */
    public function view(CollectionEntryRequest $request): JsonResponse
    {
        $entry = SqliteCollectionMeta::getCollectionTableQuery($request->id)
            ->where('id', $request->entry)
            ->get()
            ->first();

        $resource = new CollectionEntryResource($entry);
        // todo: add poster
        $resource->with['poster'] = '';
        return $resource->response();
    }

    #[OA\Put(
        path: '/api/v1/collections/{id}/entries/{entry}',
        description: 'Update an entry by its ID in the specified collection.',
        summary: 'Update an Entry',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'contents', ref: self::SCHEMA_COLLECTION_ENTRY_REQUEST_REF),
                new OA\Property(
                    property: 'poster',
                    ref: self::SCHEMA_POSTER_BASE64_REF,
                    description: "Attach a poster (in Base64 string format).\n\n" .
                    'To convert an image into base64 (for development purposes), ' .
                    'you can use this service: https://www.base64-image.de/',
                ),
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
                    new OA\Property(property: 'poster', type: 'string', example: 'https://localhost/1.jpg'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CollectionEntryUpdateRequest $request
     * @return JsonResponse
     */
    public function update(CollectionEntryUpdateRequest $request): JsonResponse
    {
        SqliteCollectionMeta::getCollectionTableQuery($request->id)
            ->where('id', $request->entry)
            ->update($request->validated('contents'));

        $resource = new JsonResource($request->validated('contents'));
        // todo: upload poster and return its URL
        $resource->with['poster'] = '';
        return $resource->response();
    }

    #[OA\Delete(
        path: '/api/v1/collections/{id}/entries/{entry}',
        description: 'Delete/Erase an entry by its ID from the specified collection.',
        summary: 'Delete an Entry',
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
        SqliteCollectionMeta::getCollectionTableQuery($request->id)->delete($request->entry);
        return new JsonResponse(null, 204);
    }

    #[OA\Get(
        path: '/api/v1/collections/{id}/entries/random',
        description: 'Finds any random entry in the specified collection.' .
        "The more items the collection contains, the more randomized the selection will be.\n\n" .
        'To achieve the best performance, the query is limited to 1 entry picked from random offset. ' .
        'The offset\'s upper bound is the total (count) of items in the collection. ' .
        'The count itself is queried once per 60 seconds and is stored in the server\'s cache.' .
        'The random value (for offset) is generated by backend server, not by database' .
        "\n\nTODO: Add cache invalidating on delete entries/truncate collection",
        summary: 'Get a Random Entry',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['entries'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'entry', ref: self::SCHEMA_COLLECTION_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: 'https://localhost/1.jpg'),
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
     * @throws Exception
     */
    public function random(CollectionIdRequest $request): JsonResponse
    {
        $cacheKey = "items-count-{$request->user()->id}-$request->id";
        $totalRows = Cache::remember($cacheKey, 60, static function () use ($request) {
            return SqliteCollectionMeta::getCollectionTableQuery($request->id)->count('id');
        });
        $randomOffset = random_int(0, $totalRows - 1);

        $entry = SqliteCollectionMeta::getCollectionTableQuery($request->id)
            ->limit(1)
            ->offset($randomOffset)
            ->get()
            ->first();

        $resource = new CollectionEntryResource($entry);
        // todo: add poster
        $resource->with['poster'] = '';
        return $resource->response();
    }
}
