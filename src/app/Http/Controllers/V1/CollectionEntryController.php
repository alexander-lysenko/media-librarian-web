<?php

namespace App\Http\Controllers\V1;

use OpenApi\Annotations as OA;

/**
 * Collection entries controller - CRUD actions for the entries in the selected collection
 *
 * @OA\Tag(name="entries", description="Manage entries of a collection")
 */
class CollectionEntryController extends ApiV1Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/collections/{id}/entries",
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
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="201", description="WIP",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="WIP"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     */
    public function create()
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/collections/{id}/entries/{entry}",
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
     *             @OA\Property(type="string", property="message", example="WIP"),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     *     @OA\Response(response=500, ref="#/components/responses/Code500"),
     * )
     */
    public function view()
    {
    }


    /**
     * @OA\Put(
     *     path="/api/v1/collections/{id}/entries/{entry}",
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
    public function update()
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
     */
    public function delete()
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/collections/{id}/entries/random",
     *     summary="Get a random entry",
     *     description="Find any random entry in the specified collection.",
     *     tags={"entries"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\Parameter(ref="#/components/parameters/collectionId"),
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
    public function random()
    {
    }
}
