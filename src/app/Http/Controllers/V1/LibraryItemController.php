<?php

namespace App\Http\Controllers\V1;

use App\DTO\LibraryFilterDTO;
use App\Http\Requests\V1\LibraryItemCreateRequest;
use App\Http\Requests\V1\LibraryItemRequest;
use App\Http\Requests\V1\LibraryItemUpdateRequest;
use App\Http\Requests\V1\LibraryIdRequest;
use App\Http\Requests\V1\LibraryPaginatedRequest;
use App\Http\Resources\LibraryItemResource;
use App\Jobs\PosterUploadJob;
use App\Models\LibrarySearch;
use App\Models\SqliteLibraryMeta;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'items', description: 'Manage Items of a Library')]
#[OA\Schema(
    schema: 'LibraryItemExample',
    title: 'LibraryItemExample',
    description: "Example of a Library's Item passed into response." .
    'Every key except `id` represents the structure of a Library created previously.' .
    'Keys map may be different and it depends on the chosen Library.',
    properties: [
        new OA\Property(property: 'id', description: '', type: 'integer', example: 1),
        new OA\Property(property: 'Movie Title', type: 'string', example: 'Лицо со шрамом (1983)'),
        new OA\Property(property: 'Origin Title', type: 'string', example: 'Scarface'),
        new OA\Property(property: 'Release Date', type: 'string', example: '1983-12-01'),
        new OA\Property(
            property: 'Description',
            type: 'string',
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
    schema: 'LibraryItemRequestExample',
    title: 'LibraryItemRequestExample',
    description: 'Example of payload to update an Item or create a new one in the Library.',
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
), OA\Schema(
    schema: 'LibrarySearchTermExample',
    title: 'LibrarySearchTermExample',
    description: 'Example of payload to filter items in the Library.',
    properties: [
        new OA\Property(property: 'Movie Title', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'startsWith'),
            new OA\Property('value', example: 'The'),
        ])),
        new OA\Property(property: 'Origin Title', type: 'array', items: new OA\Items(oneOf: [
        ])),
        new OA\Property(property: 'Release Date', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'greaterThan'),
            new OA\Property('value', example: '1999-12-31'),
        ])),
        new OA\Property(property: 'Description', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'contains'),
            new OA\Property('value', example: 'computer hacker'),
        ])),
        new OA\Property(property: 'IMDB URL', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'equalTo'),
            new OA\Property('value', example: null),
        ])),
        new OA\Property(property: 'IMDB Rating', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'between'),
            new OA\Property('value', example: 5),
            new OA\Property('value2', example: 9),
        ])),
        new OA\Property(property: 'My Rating', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'lessThan'),
            new OA\Property('value', example: 5),
        ])),
        new OA\Property(property: 'Watched', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'notEqualTo'),
            new OA\Property('value', example: false),
        ])),
        new OA\Property(property: 'Watched At', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'lessThan'),
            new OA\Property('value', example: '2023-01-01 00:00:00'),
        ])),
        new OA\Property(property: 'Chance to Advice', type: 'array', items: new OA\Items(oneOf: [
            new OA\Property('operator', example: 'equalTo'),
            new OA\Property('value', example: 0),
        ])),
    ],
)]
/**
 * Library Items controller - CRUD actions for the items in the selected library
 */
class LibraryItemController extends ApiV1Controller
{
    #[OA\Get(
        path: '/api/v1/libraries/{id}/items',
        operationId: 'items-index',
        description: "View all Items from the specified Library.\n\n" .
        'By default the selection is paginated. ' .
        'The selection can be filtered by any field(s) of the Library using customizable search rules.',
        summary: 'Get All/Filtered Items of a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['items'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF),
            new OA\Parameter(ref: self::PARAM_SORT_ATTR_REF),
            new OA\Parameter(ref: self::PARAM_SORT_DIR_REF),
            new OA\Parameter(ref: self::PARAM_PAGE_REF),
            new OA\Parameter(ref: self::PARAM_PER_PAGE_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(
                        property: 'items',
                        type: 'array',
                        items: new OA\Items(ref: self::SCHEMA_LIBRARY_ENTRY_REF)
                    ),
                    new OA\Property(property: 'sort', properties: [
                        new OA\Property(property: 'attribute', type: 'string', example: 'id'),
                        new OA\Property(property: 'direction', type: 'string', example: 'desc'),
                    ]),
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
     * @param LibraryIdRequest $request
     * @return JsonResponse
     */
    public function index(LibraryIdRequest $request): JsonResponse
    {
        $paginatedResource = SqliteLibraryMeta::getLibraryTableQuery($request->id)
            ->when($request->get('sort'), static fn(Builder $query) => $query->orderBy(
                $request->get('sort.attribute'),
                $request->get('sort.direction', 'asc')
            ))
            ->paginate(perPage: $request->get('perPage', 15), page: $request->get('page'));

        $pagination = [
            'currentPage' => $paginatedResource->currentPage(),
            'lastPage' => $paginatedResource->lastPage(),
            'perPage' => $paginatedResource->perPage(),
            'total' => $paginatedResource->total(),
        ];

        // TODO: replace with LibraryPaginatedResource
        $resource = new JsonResource($paginatedResource->items());
        $resource::wrap('items');
        $resource->with['pagination'] = $pagination;

        return $resource->response();
    }

    #[OA\Post(
        path: '/api/v1/libraries/{id}/items',
        operationId: 'items-create',
        description: "Add a new Item into the specified Library.\n\n" .
        ' The structure of the new Item must match the structure of the Library that a new Item is created into.',
        summary: 'Add a New Item Into a Library',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: [
                new OA\JsonContent(properties: [
                    new OA\Property(property: 'contents', ref: self::SCHEMA_LIBRARY_ENTRY_REQUEST_REF),
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
        tags: ['items'],
        parameters: [new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF)],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'item', ref: self::SCHEMA_LIBRARY_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: null),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param LibraryItemCreateRequest $request
     * @return JsonResponse
     */
    public function create(LibraryItemCreateRequest $request): JsonResponse
    {
        $contents = $request->contents;
        $id = SqliteLibraryMeta::getLibraryTableQuery($request->id)->insertGetId($contents);
        // todo: implement file uploading

        $response = array_merge(['id' => $id], $contents);
        $resource = new JsonResource($response);
        $resource::wrap('item');

        // todo: upload poster and return its URL
        $resource->with['poster'] = null;
        return $resource->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/v1/libraries/{id}/items/{item}',
        operationId: 'items-view',
        description: 'Find an Item by its ID in the specified Library.',
        summary: 'Get an Item From a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['items'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF),
            new OA\Parameter(ref: self::PARAM_ITEM_ID_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'item', ref: self::SCHEMA_LIBRARY_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: 'https://localhost/1.jpg'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ],
    )]
    /**
     * @param LibraryItemRequest $request
     * @return JsonResponse
     */
    public function view(LibraryItemRequest $request): JsonResponse
    {
        $item = SqliteLibraryMeta::getLibraryTableQuery($request->id)
            ->where('id', $request->item)
            ->get()
            ->first();

        $resource = new LibraryItemResource($item);
        // todo: add poster
        $resource->with['poster'] = '';
        return $resource->response();
    }

    #[OA\Put(
        path: '/api/v1/libraries/{id}/items/{item}',
        operationId: 'items-update',
        description: 'Update an Item by its ID in the specified Library.',
        summary: 'Update an Item in a Library',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: [
                new OA\JsonContent(properties: [
                    new OA\Property(property: 'contents', ref: self::SCHEMA_LIBRARY_ENTRY_REQUEST_REF),
                    new OA\Property(property: 'poster', ref: self::SCHEMA_POSTER_BASE64_REF),
                ]),
            ]
        ),
        tags: ['items'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF),
            new OA\Parameter(ref: self::PARAM_ITEM_ID_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'WIP',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'item', ref: self::SCHEMA_LIBRARY_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: 'https://localhost/1.jpg'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param LibraryItemUpdateRequest $request
     * @return JsonResponse
     */
    public function update(LibraryItemUpdateRequest $request): JsonResponse
    {
        SqliteLibraryMeta::getLibraryTableQuery($request->id)
            ->where('id', $request->item)
            ->update($request->validated('contents'));


        $resource = new JsonResource($request->validated('contents'));
        // todo: upload poster and return its URL
        PosterUploadJob::dispatch(
            userId: $request->user()->id,
            libraryId: $request->id,
            itemId: $request->item,
            poster: $request->get('poster'),
        );
        $resource->with['poster'] = '';
        return $resource->response();
    }

    #[OA\Delete(
        path: '/api/v1/libraries/{id}/items/{item}',
        operationId: 'items-delete',
        description: 'Delete/Erase an Item by its ID from the specified Library.',
        summary: /** @lang text */ 'Delete an Item From a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['items'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF),
            new OA\Parameter(ref: self::PARAM_ITEM_ID_REF),
        ],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * TODO: Implement idempotence
     * @param LibraryItemRequest $request
     * @return JsonResponse
     */
    public function delete(LibraryItemRequest $request): JsonResponse
    {
        SqliteLibraryMeta::getLibraryTableQuery($request->id)->delete($request->item);
        return new JsonResponse(null, 204);
    }

    #[OA\Post(
        path: '/api/v1/libraries/{id}/items/search',
        operationId: 'items-search',
        description: 'Just the same as `[GET] /api/v1/libraries/{id}/items` but supports flexible search term',
        summary: 'Search/Filter Items From a Library',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'term', ref: self::SCHEMA_LIBRARY_SEARCH_TERM_REF),
            ])
        ),
        tags: ['items'],
        parameters: [
            new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF),
            new OA\Parameter(ref: self::PARAM_SORT_ATTR_REF),
            new OA\Parameter(ref: self::PARAM_SORT_DIR_REF),
            new OA\Parameter(ref: self::PARAM_PAGE_REF),
            new OA\Parameter(ref: self::PARAM_PER_PAGE_REF),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(
                        property: 'items',
                        type: 'array',
                        items: new OA\Items(ref: self::SCHEMA_LIBRARY_ENTRY_REF)
                    ),
                    new OA\Property(property: 'sort', properties: [
                        new OA\Property(property: 'attribute', type: 'string', example: 'id'),
                        new OA\Property(property: 'direction', type: 'string', example: 'desc'),
                    ]),
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
     * @param LibraryPaginatedRequest $request
     * @param LibrarySearch $librarySearch
     * @return JsonResponse
     */
    public function search(LibraryPaginatedRequest $request, LibrarySearch $librarySearch): JsonResponse
    {
        $filterDto = LibraryFilterDTO::fromRequest($request);
        // todo: test it
        $paginatedResource = $librarySearch->search($filterDto);

        $pagination = [
            'currentPage' => $paginatedResource->currentPage(),
            'lastPage' => $paginatedResource->lastPage(),
            'perPage' => $paginatedResource->perPage(),
            'total' => $paginatedResource->total(),
        ];

        $resource = new JsonResource($paginatedResource->items());
        $resource::wrap('items');
        $resource->with['pagination'] = $pagination;
        return $resource->response();
    }

    #[OA\Get(
        path: '/api/v1/libraries/{id}/items/random',
        operationId: 'items-random',
        description: 'Finds any random Item in the specified Library.' .
        "The more Items the Library contains, the more randomized the selection will be.\n\n" .
        'To achieve the best performance, the query is limited to 1 item picked from random offset. ' .
        'The offset\'s upper bound is the total (count) of items in the Library. ' .
        'The count itself is queried once per 60 seconds and is stored in the server\'s cache.' .
        'The random value (for offset) is generated by backend server, not by database' .
        "\n\nTODO: Add cache invalidating on delete items/truncate Library",
        summary: 'Get a Random Item From a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['items'],
        parameters: [new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF)],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'item', ref: self::SCHEMA_LIBRARY_ENTRY_REF),
                    new OA\Property(property: 'poster', type: 'string', example: 'https://localhost/1.jpg'),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param LibraryIdRequest $request
     * @return JsonResponse
     * @throws Exception
     */
    public function random(LibraryIdRequest $request): JsonResponse
    {
        $cacheKey = "items-count-{$request->user()->id}-$request->id";
        $totalRows = Cache::remember($cacheKey, 60, static function () use ($request) {
            return SqliteLibraryMeta::getLibraryTableQuery($request->id)->count('id');
        });
        $randomOffset = random_int(0, $totalRows - 1);

        $item = SqliteLibraryMeta::getLibraryTableQuery($request->id)
            ->limit(1)
            ->offset($randomOffset)
            ->get()
            ->first();

        $resource = new LibraryItemResource($item);
        // todo: add poster
        $resource->with['poster'] = '';
        return $resource->response();
    }
}
