<?php

namespace App\Http\Controllers\V1;

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
 *
 * @OA\Response(
 *     response="Code401",
 *     description="Unauthorized",
 *     @OA\JsonContent(type="object",
 *         @OA\Property(type="string", property="message", example="401 Authentication Required")
 *     )
 * ),
 *
 * @OA\Response(
 *     response="Code422",
 *     description="Unprocessable Entity",
 *     @OA\JsonContent(type="object",
 *         @OA\Property(type="string", property="message", example="The given data was invalid")
 *     )
 * ),
 *
 * @OA\Response(
 *     response="Code500",
 *     description="Internal Server Error",
 *     @OA\JsonContent(type="object",
 *         @OA\Property(type="string", property="message", example="An internal server error occurred")
 *     )
 * ),
 *
 * @OA\Tag(name="guest", description="Guest (Unauthenticated User)")
 * @OA\Tag(name="profile", description="Profile (Authenticated User)")
 * @OA\Tag(name="collections", description="Manage collections")
 * @OA\Tag(name="entries", description="Manage entries of a collection")
 *
 * @OA\Schema(schema="DataTypes",
 *     type="string",
 *     enum={
 *         "line",
 *         "text",
 *         "date",
 *         "datetime",
 *         "url",
 *         "checkmark",
 *         "rating_5stars",
 *         "rating_10stars",
 *         "priority"
 *     },
 * )
 */
abstract class ApiV1Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
