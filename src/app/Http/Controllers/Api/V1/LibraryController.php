<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\PaginationParamsDto;
use App\Http\Controllers\Api\ApiV1Controller;
use App\Http\Requests\V1\CreateLibraryRequest;
use App\Http\Requests\V1\LibraryIdRequest;
use App\Http\Requests\V1\PaginateLibrariesRequest;
use App\Http\Resources\PaginatedJsonResource;
use App\Jobs\PosterBatchRemoveJob;
use App\Models\LibrarySearch;
use App\Models\SqliteLibraryMeta;
use App\Repositories\LibraryRepository;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'DataTypes',
    description: 'List of available types to be used for building inputs',
    type: 'string',
    enum: [
        '"line" - Single-line plain text',
        '"text" - Multi-line plain text',
        '"date" - Date (format YYYY-MM-DD)',
        '"datetime" - Date with Time (format YYYY-MM-DD hh:mm:ss)',
        '"url" - URL address displayed as hyperlink (interactive)',
        '"checkmark" - Boolean value (1 or 0) displayed as "Yes" or "No"',
        '"rating5" - Rating displayed as 5 stars',
        '"rating5precision" - Rating displayed as 5 stars (half star available)',
        '"rating10" - Rating displayed as 10 stars',
        '"rating10precision" - Rating displayed as 10 stars (half star available)',
        '"priority" - Select a value from range [-5 to 5], each one has its own name (from "Lowest" to "Highest")',
    ],
), OA\Schema(
    schema: 'LibraryExample',
    description: "Key-value pair representing data types and describing the structure of a Library's table",
    type: 'object',
    example: [
        'Movie Title' => 'line',
        'Origin Title' => 'line',
        'Release Date' => 'date',
        'Description' => 'text',
        'IMDB URL' => 'url',
        'IMDB Rating' => 'rating10',
        'My Rating' => 'rating5precision',
        'Watched' => 'checkmark',
        'Added At' => 'datetime',
        'Chance To Recommend' => 'priority',
    ],
)]
/**
 * Library Controller - manage CRUD operations for the Libraries
 */
class LibraryController extends ApiV1Controller
{
    public function __construct(
        private readonly LibraryRepository $libraryRepository,
    ) {}

    #[OA\Get(
        path: '/api/v1/libraries',
        operationId: 'libraries-index',
        description: "The response contains a list of IDs and schemas of all Libraries already created.\n\n" .
        'By default the selection is paginated. To get all items, set `perPage` parameter to `0`.',
        summary: 'List / Get All Libraries',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['libraries'],
        parameters: [
            new OA\Parameter(
                parameter: 'filter',
                name: 'filter',
                description: 'Filter by title',
                in: 'query',
                schema: new OA\Schema(type: 'string')
            ),
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
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                        new OA\Property(property: 'fields', ref: self::SCHEMA_LIBRARY_REF),
                    ])),
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
        ]
    )]
    public function index(PaginateLibrariesRequest $request, LibrarySearch $searchModel): JsonResponse
    {
        $paginatedResource = $searchModel->search(
            pagination: PaginationParamsDto::fromRequest($request),
            filter: $request->input('filter'),
        );
        $paginatedResource->transform(function (SqliteLibraryMeta $libraryMeta) {
            return [
                'id' => $libraryMeta->id,
                'title' => $libraryMeta->tbl_name,
                'fields' => json_decode(json: $libraryMeta->meta, associative: true, flags: JSON_OBJECT_AS_ARRAY),
            ];
        });

        $resource = new PaginatedJsonResource($paginatedResource);
        $resource->wrap('data');
        $resource->withSort(...$request->array('sort'));

        return $resource->response();
    }

    #[OA\Post(
        path: '/api/v1/libraries',
        operationId: 'libraries-create',
        description: "A new Library is created from the parameters passed into the request body.\n\n" .
        '*Important:* Fields order matters! Actions with items from the Library may require strict order of fields.',
        summary: 'Create a New Library',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                    new OA\Property(
                        property: 'fields',
                        description: 'See the schema to view all the available types can be passed',
                        type: 'array',
                        items: new OA\Items(properties: [
                            new OA\Property(property: 'name', type: 'string', example: 'Movie Title'),
                            new OA\Property(property: 'type', ref: self::SCHEMA_TYPES_REF, example: 'line'),
                        ]),
                        example: [
                            ['name' => 'Movie Title', 'type' => 'line'],
                            ['name' => 'Origin Title', 'type' => 'line'],
                            ['name' => 'Release Date', 'type' => 'date'],
                            ['name' => 'Description', 'type' => 'text'],
                            ['name' => 'IMDB URL', 'type' => 'url'],
                            ['name' => 'IMDB Rating', 'type' => 'rating10'],
                            ['name' => 'My Rating', 'type' => 'rating5precision'],
                            ['name' => 'Watched', 'type' => 'checkmark'],
                            ['name' => 'Added At', 'type' => 'datetime'],
                            ['name' => 'Chance To Recommend', 'type' => 'priority'],
                        ],
                    ),
                ]
            )
        ),
        tags: ['libraries'],
        responses: [
            new OA\Response(
                response: '201',
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                        new OA\Property(property: 'fields', ref: self::SCHEMA_LIBRARY_REF),
                    ]),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function create(CreateLibraryRequest $request): JsonResponse
    {
        $title = $request->input('title');
        $fields = Arr::pluck($request->input('fields'), 'type', 'name');

        $library = $this->libraryRepository->create($title, $fields);
        $resource = new JsonResource([
            'id' => $library->id,
            'title' => $title,
            'fields' => $fields,
        ]);

        return $resource->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/v1/libraries/{id}',
        operationId: 'libraries-view',
        description: 'View the structure (schema) of a particular Library.',
        summary: 'Get the Metadata of a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['libraries'],
        parameters: [new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF)],
        responses: [
            new OA\Response(
                response: '200',
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                        new OA\Property(property: 'fields', ref: self::SCHEMA_LIBRARY_REF),
                    ]),
                    new OA\Property(property: 'meta', properties: [
                        new OA\Property(property: 'created_at', type: 'string', example: '1970-01-01 00:00:00'),
                        new OA\Property(property: 'items_count', type: 'integer', example: 1),
                    ]),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function view(LibraryIdRequest $request): JsonResponse
    {
        $libraryMeta = $this->libraryRepository->getById($request->id);

        $resource = new JsonResource([
            'id' => $libraryMeta->id,
            'title' => $libraryMeta->tbl_name,
            'fields' => json_decode($libraryMeta->meta, JSON_OBJECT_AS_ARRAY),
        ]);
        $resource->with['meta'] = [
            'created_at' => Carbon::parse($libraryMeta->created_at)->format('Y-m-d H:i:s'),
            'items_count' => $libraryMeta->getItemsCount(),
        ];

        return $resource->response();
    }

    #[OA\Delete(
        path: '/api/v1/libraries/{id}',
        operationId: 'libraries-delete',
        description: 'Remove a particular Library including all its Items. The operation cannot be undone.',
        summary: 'Delete a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['libraries'],
        parameters: [new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF)],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function delete(LibraryIdRequest $request): JsonResponse
    {
        $libraryId = $request->id;

        $this->libraryRepository->deleteById($libraryId);
        $this->libraryRepository->resetCachedCount($libraryId);
        PosterBatchRemoveJob::dispatch(['userId' => $request->user()->id, 'libraryId' => $libraryId]);

        return new JsonResponse(null, 204);
    }

    #[OA\Patch(
        path: '/api/v1/libraries/{id}',
        operationId: 'libraries-clear',
        description: 'Remove all Items from a particular Library but not the Library itself (i.e. truncate). ' .
        'The operation cannot be undone.',
        summary: 'Clear (Truncate) a Library',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['libraries'],
        parameters: [new OA\Parameter(ref: self::PARAM_LIBRARY_ID_REF)],
        responses: [
            new OA\Response(
                response: '200',
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                    ]),
                    new OA\Property(property: 'meta', properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'truncated'),
                        new OA\Property(property: 'items_affected', type: 'integer', example: 10),
                    ]),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    public function clear(LibraryIdRequest $request): JsonResponse
    {
        $libraryId = $request->id;

        $libraryMeta = $this->libraryRepository->getById($libraryId);
        $itemsAffected = $this->libraryRepository->cleanUpById($libraryId);
        $this->libraryRepository->resetCachedCount($libraryId);

        PosterBatchRemoveJob::dispatch(['userId' => $request->user()->id, 'libraryId' => $libraryId]);

        $resource = new JsonResource([
            'id' => $libraryMeta->id,
            'title' => $libraryMeta->tbl_name,
        ]);
        $resource->with['meta'] = ['status' => 'truncated', 'items_affected' => $itemsAffected];

        return $resource->response()->setStatusCode(200);
    }
}
