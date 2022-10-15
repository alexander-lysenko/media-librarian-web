<?php

namespace App\Http\Controllers\V1;

use App\Http\Requests\V1\CreateCollectionRequest;
use App\Services\UserDatabaseService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use OpenApi\Annotations as OA;

/**
 * Collections controller - manage list of collections, CRUD operations for the collections
 */
class CollectionController extends ApiV1Controller
{

    /**
     *
     */
    public function index()
    {
    }

    /**
     * @OA\Post(
     *     path="/api/v1/collection/create",
     *     summary="Create a New Collection",
     *     description="The structure of the new collection is created from the parameters passed in request body.",
     *     tags={"collection"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *                 @OA\Property(property="title", type="string", example="Movies"),
     *                 @OA\Property(property="fields",
     *                     type="array",
     *                     description="See the schema to view the available types to be passed",
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
     *                     @OA\Items(
     *                         @OA\Property(property="name", type="string", example="Movie Title"),
     *                         @OA\Property(property="type",
     *                             type="string",
     *                             example="line",
     *                             enum={
     *                                 "line",
     *                                 "text",
     *                                 "date",
     *                                 "datetime",
     *                                 "url",
     *                                 "checkmark",
     *                                 "rating_5stars",
     *                                 "rating_10stars",
     *                                 "priority"
     *                             },
     *                         ),
     *                     ),
     *                 ),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="200", description="OK",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="object",
     *                 property="data",
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
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     * )
     *
     * @param CreateCollectionRequest $request
     * @param UserDatabaseService $databaseService
     * @return JsonResource
     */
    public function create(CreateCollectionRequest $request, UserDatabaseService $databaseService): JsonResource
    {
        $databaseService->setUserId($request->user()->id);
        $db = $databaseService->getDbConnection();

        $title = $request->input('title');
        $metadata = Arr::pluck($request->input('fields'), 'type', 'name');

        $db->getSchemaBuilder()->create($title, function (Blueprint $table) use ($metadata, $databaseService) {
            foreach ($metadata as $name => $type) {
                if ($name === array_key_first($metadata)) {
                    $table->lineString($name)->unique();
                    continue;
                }
                $databaseService->createTableColumnByType($table, $name, $type);
            }
        });
        $databaseService->insertMetadata($title, $metadata);

        return new JsonResource([
            'title' => $title,
            'fields' => $metadata,
        ]);
    }

    /**
     *
     */
    public function view()
    {
    }

    /**
     *
     */
    public function delete()
    {
    }

    /**
     *
     */
    public function clear()
    {
    }
}
