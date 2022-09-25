<?php

namespace App\Http\Controllers\V1;

use App\Exceptions\ConfigurationException;
use App\Services\UserDatabaseService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Schema;
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
     *     summary="",
     *     description="",
     *     tags={"collection"},
     *     security={{"BearerAuth": {}}},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(mediaType="application/json",
     *             @OA\Schema(type="object",
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response="200", description="OK",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="object", property="results",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(response=401, ref="#/components/responses/Code401"),
     * )
     *
     * @param Request $request
     * @param UserDatabaseService $databaseService
     * @return JsonResponse
     * @throws ConfigurationException
     */
    public function create(Request $request, UserDatabaseService $databaseService): JsonResponse
    {
        $databaseService->setUserId($request->user()->id);
        $db = $databaseService->getDbConnection();
        // $db->getSchemaBuilder()->create($tableName, function (Blueprint $table) {
        //     $table->id();
        //     $table->lineString('name')->unique();
        // });

        return Response::json([]);
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
