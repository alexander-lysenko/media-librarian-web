<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\CollectionEntryRequest;
use App\Http\Requests\V1\CollectionIdRequest;
use App\Http\Requests\V1\CreateCollectionEntryRequest;
use App\Models\SqliteCollectionMeta;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Annotations as OA;

/**
 * Collection entries controller - CRUD actions for the entries in the selected collection
 *
 * @OA\Tag(name="entries", description="Manage entries of a collection")
 *
 * @OA\Schema(schema="CollectionEntryExample",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="Movie Title", type="string", example="Лицо со шрамом"),
 *     @OA\Property(property="Origin Title", type="string", example="Scarface"),
 *     @OA\Property(property="Release Date", type="string", example="1983-12-01"),
 *     @OA\Property(property="Description", type="text",
 *         example="In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed."),
 *     @OA\Property(property="IMDB URL", type="string", example="https://www.imdb.com/title/tt0086250/"),
 *     @OA\Property(property="IMDB Rating", type="integer", example=8),
 *     @OA\Property(property="My Rating", type="integer", example=5),
 *     @OA\Property(property="Watched", type="boolean", example=true),
 *     @OA\Property(property="Watched At", type="string", example="2020-01-01 00:00:01"),
 *     @OA\Property(property="Chance to Advice", type="integer", example="5"),
 * )
 *
 *
 */
class CollectionEntryController extends ApiV1Controller
{
    /**
     * @OA\Get(path="/api/v1/collections/{id}/entries",
     *     summary="View all/filtered entries of a collection",
     *     description="View all entries from the specified collection. By default the selection is paginated.
    The selection can be filtered by any of collection fields using customizable search rules.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
     *
     *     @OA\Response(response="201", description="WIP",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="entries", type="array",
     *                 @OA\Items(type="object", ref="#/components/schemas/CollectionEntryExample")
     *             ),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     */
    public function index(CollectionIdRequest $request): JsonResponse
    {
        $entries = $this->getCollectionTableQuery($request->id)->simplePaginate();
        // todo: improve pagination
        $resource = new JsonResource($entries);
        // $resource::wrap('entries');

        return $resource->response();
    }

    /**
     * @OA\Post(path="/api/v1/collections/{id}/entries",
     *     summary="Add a new entry",
     *     description="Create a new entry into the specified collection. The structure of the new entry
    must match the structure of the collection that a new entry is created into.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *                 @OA\Property(property="contents", type="object",
     *                     @OA\Property(property="Movie Title", type="string", example="Лицо со шрамом"),
     *                     @OA\Property(property="Origin Title", type="string", example="Scarface"),
     *                     @OA\Property(property="Release Date", type="string", example="1983-12-01"),
     *                     @OA\Property(property="Description", type="text",
     *      example="In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed."),
     *                     @OA\Property(property="IMDB URL", example="https://www.imdb.com/title/tt0086250/"),
     *                     @OA\Property(property="IMDB Rating", type="integer", example=8),
     *                     @OA\Property(property="My Rating", type="integer", example=5),
     *                     @OA\Property(property="Watched", type="boolean", example=true),
     *                     @OA\Property(property="Watched At", type="string", example="2020-01-01 00:00:01"),
     *                     @OA\Property(property="Chance to Advice", type="integer", example="5"),
     *                 ),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="201", description="Created",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="entry", type="object", ref="#/components/schemas/CollectionEntryExample"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
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

    /**
     * @OA\Get(path="/api/v1/collections/{id}/entries/{entry}",
     *     summary="View/Open an entry",
     *     description="Find an entry by its ID in the specified collection.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
     *     @OA\Parameter(ref="#/components/parameters/entryId"),
     *
     *     @OA\Response(response="200", description="WIP",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="entry", type="object", ref="#/components/schemas/CollectionEntryExample"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     */
    public function view(CollectionEntryRequest $request)
    {
    }

    /**
     * @OA\Put(path="/api/v1/collections/{id}/entries/{entry}",
     *     summary="Update an entry",
     *     description="Update an entry by its ID in the specified collection.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
     *     @OA\Parameter(ref="#/components/parameters/entryId"),
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="200", description="WIP",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="WIP"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     */
    public function update(CreateCollectionEntryRequest $request)
    {
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/collections/{id}/entries/{entry}",
     *     summary="Delete an entry",
     *     description="Delete an entry by its ID from the specified collection.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
     *     @OA\Parameter(ref="#/components/parameters/entryId"),
     *
     *     @OA\Response(response="200", description="WIP",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="WIP"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
     * @param CollectionEntryRequest $request
     * @return JsonResponse
     */
    public function delete(CollectionEntryRequest $request): JsonResponse
    {
        return new JsonResponse(null, 204);
    }

    /**
     * @OA\Get(path="/api/v1/collections/{id}/entries/random",
     *     summary="Get a random entry",
     *     description="Find any random entry in the specified collection.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
     *
     *     @OA\Response(response="200", description="WIP",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="entry", type="object", ref="#/components/schemas/CollectionEntryExample"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     *
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
