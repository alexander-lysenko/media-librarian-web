<?php

namespace App\Http\Controllers\V1;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: 1,
    description: 'Internal API v1 Documentation for the Media Librarian Web App',
    title: 'Media Librarian Web: API',
    contact: new OA\Contact(name: 'admin@example.com', email: 'admin@example.com'),
    license: new OA\License('ISC'),
), OA\SecurityScheme(
    securityScheme: 'BearerAuth',
    type: 'http',
    description: 'Paste your Bearer token here. You can obtain a token at the endpoint: `/api/v1/user/login`',
    name: 'api_bearer_token',
    in: 'header',
    scheme: 'bearer',
)]
#[OA\Response(
    response: 'Code204',
    description: 'No Content',
    content: new OA\JsonContent(example: null)
), OA\Response(
    response: 'Code401',
    description: 'Unauthorized',
    content: new OA\JsonContent(properties: [
        new OA\Property(property: 'message', type: 'string', example: '401 Authentication Required'),
    ])
), OA\Response(
    response: 'Code422',
    description: 'Unprocessable Entity',
    content: new OA\JsonContent(properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The given data was invalid'),
    ])
), OA\Response(
    response: 'Code500',
    description: 'Internal Server Error',
    content: new OA\JsonContent(properties: [
        new OA\Property(property: 'message', type: 'string', example: 'An internal server error occurred'),
    ])
)]
/**
 * Base controller for API v1 routing in application
 */
abstract class ApiV1Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public const SECURITY_SCHEME_BEARER = [['BearerAuth' => []]];

    public const PARAM_COLLECTION_ID_REF = '#/components/parameters/collectionId';
    public const PARAM_ENTRY_ID_REF = '#/components/parameters/entryId';

    public const RESPONSE_204_REF = '#/components/responses/Code204';
    // public const RESPONSE_400_REF = '#/components/responses/Code400';
    public const RESPONSE_401_REF = '#/components/responses/Code401';
    // public const RESPONSE_404_REF = '#/components/responses/Code404';
    public const RESPONSE_422_REF = '#/components/responses/Code422';
    public const RESPONSE_500_REF = '#/components/responses/Code500';

    public const SCHEMA_PROFILE_REF = '#/components/schemas/Profile';

    public const SCHEMA_TYPES_REF = '#/components/schemas/DataTypes';
    public const SCHEMA_COLLECTION_REF = '#/components/schemas/CollectionExample';
    public const SCHEMA_COLLECTION_ENTRY_REF = '#/components/schemas/CollectionEntryExample';

    #[OA\Parameter(
        parameter: 'collectionId',
        name: 'id',
        description: 'The ID of an existing collection',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer', example: 1),
    )]
    private string $collectionId = self::PARAM_COLLECTION_ID_REF;

    #[OA\Parameter(
        parameter: 'entryId',
        name: 'entry',
        description: 'The ID of an existing entry',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer', example: 1),
    )]
    private string $entryId = self::PARAM_ENTRY_ID_REF;
}
