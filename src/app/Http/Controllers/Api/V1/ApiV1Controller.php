<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use OpenApi\Annotations as OA;

/**
 * Base controller for API v1 routing in application
 *
 * @OA\Info(
 *     title="Media Librarian Web: API",
 *     description="Internal API v1 Documentation for the Media Librarian Web App",
 *     version="1",
 *     @OA\Contact(email="admin@example.com", name="admin@example.com"),
 * ),
 *
 * @OA\SecurityScheme(
 *     in="header",
 *     type="http",
 *     scheme="bearer",
 *     name="api_bearer_token",
 *     securityScheme="BearerAuth",
 *     description="Paste your Bearer token here",
 * ),
 */
abstract class ApiV1Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
