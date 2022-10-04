<?php

namespace App\Http\Controllers\V1;

use App\Services\UserDatabaseService;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * Controller for sandbox. Do not use this code on production
 */
class TestController extends ApiV1Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/test",
     *     security={{"BearerAuth": {}}},
     *     @OA\Response(response="200", description="TEST",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(type="string", property="message", example="TEST")
     *         ),
     *     )
     * )
     * @param Request $request
     * @param UserDatabaseService $service
     * @return void
     */
    public function test(Request $request, UserDatabaseService $service)
    {
        $service->setUserId($request->user()->id)->getDbConnection();
        var_dump($service);
    }
}
