<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\CollectionIdRequest;
use App\Http\Requests\V1\CreateCollectionRequest;
use App\Models\SqliteCollectionMeta;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use OpenApi\Attributes as OA;
use Throwable;

#[OA\Tag(name: 'collections', description: 'Manage collections')]
#[OA\Schema(
    schema: 'DataTypes',
    description: 'List of available types to be used for building inputs',
    type: 'string',
    enum: ['line', 'text', 'date', 'datetime', 'url', 'checkmark', 'rating_5stars', 'rating_10stars', 'priority'],
), OA\Schema(
    schema: 'CollectionExample',
    description: "Key-value pair representing data types and describing the structure of a collection's table",
    type: 'object',
    example: [
        'Movie Title' => 'line',
        'Origin Title' => 'line',
        'Release Date' => 'date',
        'Description' => 'text',
        'IMDB URL' => 'url',
        'IMDB Rating' => 'rating_10stars',
        'My Rating' => 'rating_5stars',
        'Watched' => 'checkmark',
        'Watched At' => 'datetime',
        'Chance to Advice' => 'priority',
    ],
)]
/**
 * Collections controller - manage list of collections, CRUD operations for the collections
 */
class CollectionController extends ApiV1Controller
{
    #[OA\Get(
        path: '/api/v1/collections',
        description: 'The response contains the list of ID and name of all collections already created ' .
        'and the columns that included in each collection.',
        summary: 'Get All Collections',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['collections'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'Movies'),
                        new OA\Property(property: 'fields', ref: self::SCHEMA_COLLECTION_REF),
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

        $metadataRows = SqliteCollectionMeta::query()->get()->all();
        $collections = array_map(static function ($row) {
            $item = [];

            $item['id'] = $row->id;
            $item['name'] = $row->tbl_name;
            $item['fields'] = json_decode($row->meta, true, 512, JSON_OBJECT_AS_ARRAY);

            return $item;
        }, $metadataRows);

        /** @noinspection OneTimeUseVariablesInspection */
        $resource = new JsonResource($collections);

        return $resource->response();
    }

    #[OA\Post(
        path: '/api/v1/collections',
        description: 'The structure of the new collection is created from the parameters passed in request body.',
        summary: 'Create a New Collection',
        security: self::SECURITY_SCHEME_BEARER,
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                    new OA\Property(
                        property: 'fields',
                        description: 'See the schema to view the available types to be passed',
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
                            ['name' => 'IMDB Rating', 'type' => 'rating_10stars'],
                            ['name' => 'My Rating', 'type' => 'rating_5stars'],
                            ['name' => 'Watched', 'type' => 'checkmark'],
                            ['name' => 'Watched At', 'type' => 'datetime'],
                            ['name' => 'Chance to Advice', 'type' => 'priority'],
                        ],
                    ),
                ]
            )
        ),
        tags: ['collections'],
        responses: [
            new OA\Response(
                response: '201',
                description: 'Created',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                        new OA\Property(property: 'fields', ref: self::SCHEMA_COLLECTION_REF),
                    ]),
                ])
            ),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CreateCollectionRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function create(CreateCollectionRequest $request): JsonResponse
    {
        $sqliteCollectionMeta = new SqliteCollectionMeta();
        $connection = $sqliteCollectionMeta->getConnection();

        $connection->transaction(function () use ($connection, $request, $sqliteCollectionMeta, &$resource) {
            $title = $request->input('title');
            $metadata = Arr::pluck($request->input('fields'), 'type', 'name');

            $createTableSchema = function (Blueprint $table) use ($metadata, $sqliteCollectionMeta) {
                $table->id();
                foreach ($metadata as $name => $type) {
                    if ($name === array_key_first($metadata)) {
                        $table->lineString($name)->unique();
                        continue;
                    }
                    $sqliteCollectionMeta->createTableColumnByType($table, $name, $type);
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

            $sqliteCollectionMeta->fill([
                'tbl_name' => $title,
                'schema' => $schema,
                'meta' => json_encode($metadata, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ])->save();

            $resource = new JsonResource([
                'id' => $sqliteCollectionMeta->id,
                'title' => $title,
                'fields' => $metadata,
            ]);
        });

        return $resource->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/v1/collections/{id}',
        description: 'View the structure of the already existing collection.',
        summary: 'View the Metadata of a Collection',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['collections'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
        responses: [
            new OA\Response(
                response: '200',
                description: 'OK',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'title', type: 'string', example: 'Movies'),
                        new OA\Property(property: 'fields', ref: self::SCHEMA_COLLECTION_REF),
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
     * @param CollectionIdRequest $request
     * @return JsonResponse
     */
    public function view(CollectionIdRequest $request): JsonResponse
    {
        /** @var SqliteCollectionMeta $sqliteCollectionMeta */
        $sqliteCollectionMeta = SqliteCollectionMeta::query()->where('id', $request->id)->first();
        $connection = $sqliteCollectionMeta->getConnection();

        $itemsCount = $connection->query()
            ->select($connection->raw('count(*) as count'))
            ->from($sqliteCollectionMeta->tbl_name)
            ->value('count');
        $createdAtCarbon = new Carbon($sqliteCollectionMeta->created_at);

        $resource = new JsonResource([
            'id' => $sqliteCollectionMeta->id,
            'title' => $sqliteCollectionMeta->tbl_name,
            'fields' => json_decode($sqliteCollectionMeta->meta, JSON_OBJECT_AS_ARRAY),
        ]);
        $resource->with['meta'] = [
            'created_at' => $createdAtCarbon->format('Y-m-d H:i:s'),
            'items_count' => (int)$itemsCount,
        ];

        return $resource->response();
    }

    #[OA\Delete(
        path: '/api/v1/collections/{id}',
        description: 'Remove the specified collection along with all items included. The operation cannot be undone.',
        summary: 'Delete a Collection',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['collections'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
        responses: [
            new OA\Response(ref: self::RESPONSE_204_REF, response: 204),
            new OA\Response(ref: self::RESPONSE_401_REF, response: 401),
            new OA\Response(ref: self::RESPONSE_422_REF, response: 422),
            new OA\Response(ref: self::RESPONSE_500_REF, response: 500),
        ]
    )]
    /**
     * @param CollectionIdRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function delete(CollectionIdRequest $request): JsonResponse
    {
        /** @var SqliteCollectionMeta $sqliteCollectionMeta */
        $sqliteCollectionMeta = SqliteCollectionMeta::query()->where('id', $request->id)->first();
        $connection = $sqliteCollectionMeta->getConnection();

        $connection->transaction(function () use ($connection, $sqliteCollectionMeta) {
            // Remove posters (use background job)

            $connection->getSchemaBuilder()->drop($sqliteCollectionMeta->tbl_name);
            $sqliteCollectionMeta->delete();
        });

        return new JsonResponse(null, 204);
    }

    #[OA\Patch(
        path: '/api/v1/collections/{id}',
        description: 'Remove all items from the specified collection but not the collection itself. ' .
        'The operation cannot be undone.',
        summary: 'Clear (Truncate) a Collection',
        security: self::SECURITY_SCHEME_BEARER,
        tags: ['collections'],
        parameters: [new OA\Parameter(ref: self::PARAM_COLLECTION_ID_REF)],
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
     * @param CollectionIdRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function clear(CollectionIdRequest $request): JsonResponse
    {
        /** @var SqliteCollectionMeta $sqliteCollectionMeta */
        $sqliteCollectionMeta = SqliteCollectionMeta::query()->where('id', $request->id)->first();
        $connection = $sqliteCollectionMeta->getConnection();

        $connection->transaction(function () use ($connection, $sqliteCollectionMeta, &$itemsAffected) {
            // Remove posters (use background job)

            $itemsAffected = $connection->query()
                ->select($connection->raw('count(*) as count'))
                ->from($sqliteCollectionMeta->tbl_name)
                ->value('count');
            $connection->table($sqliteCollectionMeta->tbl_name)->truncate();
        });

        $resource = new JsonResource([
            'id' => $sqliteCollectionMeta->id,
            'title' => $sqliteCollectionMeta->tbl_name,
        ]);
        $resource->with['meta'] = [
            'status' => 'truncated',
            'items_affected' => (int)$itemsAffected,
        ];

        return $resource->response(200);
    }
}
