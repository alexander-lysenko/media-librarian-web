<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\LibraryIdRequest;
use App\Http\Requests\V1\CreateLibraryRequest;
use App\Models\SqliteLibraryMeta;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use OpenApi\Attributes as OA;
use Throwable;

#[OA\Tag(name: 'libraries', description: 'Manage Libraries')]
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
        'Watched At' => 'datetime',
        'Chance to Advice' => 'priority',
    ],
)]
/**
 * Library Controller - manage CRUD operations for the Libraries
 */
class LibraryController extends ApiV1Controller
{
    #[OA\Get(
        path: '/api/v1/libraries',
        operationId: 'libraries-index',
        description: 'The response contains the list of ID and name of all Libraries already created ' .
        'and the columns that included in each Library.',
        summary: 'Get All Libraries',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['libraries'],
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
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $request->hasValidSignature(); // stub

        $metadataRows = SqliteLibraryMeta::query()->get()->all();
        $libraries = array_map(static function ($row) {
            $item = [];

            $item['id'] = $row->id;
            $item['title'] = $row->tbl_name;
            $item['fields'] = json_decode($row->meta, true, 512, JSON_OBJECT_AS_ARRAY);

            return $item;
        }, $metadataRows);

        /** @noinspection OneTimeUseVariablesInspection */
        $resource = new JsonResource($libraries);

        return $resource->response();
    }

    #[OA\Post(
        path: '/api/v1/libraries',
        operationId: 'libraries-create',
        description: 'The structure of the new Library is created from the parameters passed in request body.',
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
                            ['name' => 'Watched At', 'type' => 'datetime'],
                            ['name' => 'Chance to Advice', 'type' => 'priority'],
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
    /**
     * @param CreateLibraryRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function create(CreateLibraryRequest $request): JsonResponse
    {
        $sqliteLibraryMeta = new SqliteLibraryMeta();
        $connection = $sqliteLibraryMeta->getConnection();

        $connection->transaction(function () use ($connection, $request, $sqliteLibraryMeta, &$resource) {
            $title = $request->input('title');
            $metadata = Arr::pluck($request->input('fields'), 'type', 'name');

            $createTableSchema = function (Blueprint $table) use ($metadata, $sqliteLibraryMeta) {
                $table->id();
                foreach ($metadata as $name => $type) {
                    if ($name === array_key_first($metadata)) {
                        $table->lineString($name)->unique();
                        continue;
                    }
                    $sqliteLibraryMeta->createTableColumnByType($table, $name, $type);
                }
            };
            $connection->getSchemaBuilder()->create($title, $createTableSchema);

            $schema = $connection->query()
                ->select('sql')
                ->from('sqlite_master')
                ->where('type', '=', 'table')
                ->where('name', $title)
                ->pluck('sql')
                ->first();

            $sqliteLibraryMeta->fill([
                'tbl_name' => $title,
                'schema' => $schema,
                'meta' => json_encode($metadata, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ])->save();

            $resource = new JsonResource([
                'id' => $sqliteLibraryMeta->id,
                'title' => $title,
                'fields' => $metadata,
            ]);
        });

        return $resource->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/v1/libraries/{id}',
        operationId: 'libraries-view',
        description: 'View the structure of the already existing Library.',
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
    /**
     * @param LibraryIdRequest $request
     * @return JsonResponse
     */
    public function view(LibraryIdRequest $request): JsonResponse
    {
        /** @var SqliteLibraryMeta $sqliteLibraryMeta */
        $sqliteLibraryMeta = SqliteLibraryMeta::query()->where('id', $request->id)->first();
        $connection = $sqliteLibraryMeta->getConnection();

        $itemsCount = $connection->query()
            ->select($connection->raw('count(*) as count'))
            ->from($sqliteLibraryMeta->tbl_name)
            ->value('count');
        $createdAtCarbon = new Carbon($sqliteLibraryMeta->created_at);

        $resource = new JsonResource([
            'id' => $sqliteLibraryMeta->id,
            'title' => $sqliteLibraryMeta->tbl_name,
            'fields' => json_decode($sqliteLibraryMeta->meta, JSON_OBJECT_AS_ARRAY),
        ]);
        $resource->with['meta'] = [
            'created_at' => $createdAtCarbon->format('Y-m-d H:i:s'),
            'items_count' => (int)$itemsCount,
        ];

        return $resource->response();
    }

    #[OA\Delete(
        path: '/api/v1/libraries/{id}',
        operationId: 'libraries-delete',
        description: 'Remove the specified Library along with all Items included. The operation cannot be undone.',
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
    /**
     * TODO: Implement idempotence
     * @param LibraryIdRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function delete(LibraryIdRequest $request): JsonResponse
    {
        /** @var SqliteLibraryMeta $sqliteLibraryMeta */
        $sqliteLibraryMeta = SqliteLibraryMeta::query()->where('id', $request->id)->first();
        $connection = $sqliteLibraryMeta->getConnection();

        $connection->transaction(function () use ($connection, $sqliteLibraryMeta) {
            // Remove posters (use a background job)

            $connection->getSchemaBuilder()->drop($sqliteLibraryMeta->tbl_name);
            $sqliteLibraryMeta->delete();
        });

        return new JsonResponse(null, 204);
    }

    #[OA\Patch(
        path: '/api/v1/libraries/{id}',
        operationId: 'libraries-clear',
        description: 'Remove all Items from the specified Library but not the Library itself. ' .
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
    /**
     * TODO: Implement idempotence
     * @param LibraryIdRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function clear(LibraryIdRequest $request): JsonResponse
    {
        /** @var SqliteLibraryMeta $sqliteLibraryMeta */
        $sqliteLibraryMeta = SqliteLibraryMeta::query()->where('id', $request->id)->first();
        $connection = $sqliteLibraryMeta->getConnection();

        $connection->transaction(function () use ($connection, $sqliteLibraryMeta, &$itemsAffected) {
            // Remove posters (use a background job)

            $itemsAffected = $connection->query()
                ->select($connection->raw('count(*) as count'))
                ->from($sqliteLibraryMeta->tbl_name)
                ->value('count');
            $connection->table($sqliteLibraryMeta->tbl_name)->truncate();
        });

        $resource = new JsonResource([
            'id' => $sqliteLibraryMeta->id,
            'title' => $sqliteLibraryMeta->tbl_name,
        ]);
        $resource->with['meta'] = [
            'status' => 'truncated',
            'items_affected' => (int)$itemsAffected,
        ];

        return $resource->response()->setStatusCode(200);
    }
}
