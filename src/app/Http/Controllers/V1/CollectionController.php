<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\CreateCollectionRequest;
use App\Models\SqliteCollectionMeta;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use OpenApi\Annotations as OA;
use Throwable;

/**
 * Collections controller - manage list of collections, CRUD operations for the collections
 */
class CollectionController extends ApiV1Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/collections",
     *     summary="Get All Collections",
     *     description="The response contains the list of ID and name of all collections already created
    and the columns that included in each collection.",
     *     tags={"collections"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Response(response="200", description="OK",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Movies"),
     *                     @OA\Property(property="fields",
     *                         type="object",
     *                         example={
     *                             "Movie Title": "line",
     *                             "Origin Title": "line",
     *                             "Release Date": "date",
     *                             "Description": "text",
     *                             "IMDB URL": "url",
     *                             "IMDB Rating": "rating_10stars",
     *                             "My Rating": "rating_5stars",
     *                             "Watched": "checkmark",
     *                             "Watched At": "datetime",
     *                             "Chance to Advice": "priority",
     *                         },
     *                     ),
     *                 ),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=422, ref="#/components/responses/Code422"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
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

        $resource = new JsonResource($collections);

        return $resource->response();
    }

    /**
     * @OA\Post(
     *     path="/api/v1/collections",
     *     summary="Create a New Collection",
     *     description="The structure of the new collection is created from the parameters passed in request body.",
     *     tags={"collections"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *                 @OA\Property(property="title", type="string", example="Movies"),
     *                 @OA\Property(property="fields", type="array",
     *                     description="See the schema to view the available types to be passed",
     *                     @OA\Items(
     *                         @OA\Property(property="name", type="string", example="Movie Title"),
     *                         @OA\Property(property="type", ref="#/components/schemas/DataTypes", example="line"),
     *                     ),
     *                     example={
     *                         {"name":"Movie Title", "type":"line"},
     *                         {"name":"Origin Title", "type":"line"},
     *                         {"name":"Release Date", "type":"date"},
     *                         {"name":"Description", "type":"text"},
     *                         {"name":"IMDB URL", "type":"url"},
     *                         {"name":"IMDB Rating", "type":"rating_10stars"},
     *                         {"name":"My Rating", "type":"rating_5stars"},
     *                         {"name":"Watched", "type":"checkmark"},
     *                         {"name":"Watched At", "type":"datetime"},
     *                         {"name":"Chance to Advice", "type":"priority"},
     *                     },
     *                 ),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="201", description="Created",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="title", type="string", example="Movies"),
     *                 @OA\Property(property="fields",
     *                     type="object",
     *                     example={
     *                         "Movie Title": "line",
     *                         "Origin Title": "line",
     *                         "Release Date": "date",
     *                         "Description": "text",
     *                         "IMDB URL": "url",
     *                         "IMDB Rating": "rating_10stars",
     *                         "My Rating": "rating_5stars",
     *                         "Watched": "checkmark",
     *                         "Watched At": "datetime",
     *                         "Chance to Advice": "priority",
     *                     },
     *                 ),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=422, ref="#/components/responses/Code422"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
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

    /**
     * @OA\Get(
     *     path="/api/v1/collections/{id}",
     *     summary="View the Metadata of a Collection",
     *     description="View the structure of the already existing collection.",
     *     tags={"collections"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(name="id", in="path", @OA\Schema(type="integer", example="1")),
     *
     *     @OA\Response(response="200", description="OK",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="title", type="string", example="Movies"),
     *                 @OA\Property(property="fields",
     *                     type="object",
     *                     example={
     *                         "Movie Title": "line",
     *                         "Origin Title": "line",
     *                         "Release Date": "date",
     *                         "Description": "text",
     *                         "IMDB URL": "url",
     *                         "IMDB Rating": "rating_10stars",
     *                         "My Rating": "rating_5stars",
     *                         "Watched": "checkmark",
     *                         "Watched At": "datetime",
     *                         "Chance to Advice": "priority",
     *                     },
     *                 ),
     *             ),
     *             @OA\Property(property="meta", type="object",
     *                 @OA\Property(property="created_at", type="string", example="1970-01-01 00:00:00"),
     *                 @OA\Property(property="items_count", type="integer", example=1),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=422, ref="#/components/responses/Code422"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function view(int $id, Request $request): JsonResponse
    {
        /** @var SqliteCollectionMeta $sqliteCollectionMeta */
        $sqliteCollectionMeta = SqliteCollectionMeta::query()
            ->where('id', '=', $id)
            ->first();
        $connection = $sqliteCollectionMeta->getConnection();

        $itemsCount = $connection->query()
            ->select($connection->raw('count(*) as count'))
            ->from("{$sqliteCollectionMeta->tbl_name}")
            ->value('count');
        $createdAt = new Carbon($sqliteCollectionMeta->created_at);

        $resource = new JsonResource([
            'id' => $sqliteCollectionMeta->id,
            'title' => $sqliteCollectionMeta->tbl_name,
            'fields' => json_decode($sqliteCollectionMeta->meta, JSON_OBJECT_AS_ARRAY),
        ]);
        $resource->with['meta'] = [
            'created_at' => $createdAt->format('Y-m-d H:i:s'),
            'items_count' => intval($itemsCount),
        ];

        return $resource->response();
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/collections/{id}",
     *     summary="Delete a Collection (WIP)",
     *     description="Remove the specified collection along with all items included. The operation cannot be undone.",
     *     tags={"collections"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(name="id", in="path", @OA\Schema(type="integer", example="1")),
     *
     *     @OA\Response(response="204", description="No Content"),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
     * @param int $id
     * @return JsonResource
     */
    public function delete(int $id): JsonResource
    {
        return new JsonResource([
            'id' => $id,
        ]);
    }

    /**
     * @OA\Patch(
     *     path="/api/v1/collections/{id}",
     *     summary="Clear a Collection (WIP)",
     *     description="Remove all items from the specified collection but not the collection itself.
    The operation cannot be undone.",
     *     tags={"collections"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(name="id", in="path", @OA\Schema(type="integer", example="1")),
     *
     *     @OA\Response(response="200", description="OK",
     *         @OA\JsonContent(type="object",
     *         ),
     *     ),
     * )
     *
     * @param int $id
     * @return JsonResource
     */
    public function clear(int $id): JsonResource
    {
        return new JsonResource([
            'id' => $id,
        ]);
    }
}
