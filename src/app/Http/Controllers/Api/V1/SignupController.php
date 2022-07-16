<?php

namespace App\Http\Controllers\Api\V1;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(path="/api/v1/user/signup",
 *     summary="Sign Up",
 *     description="Sign up a new user",
 *     tags={"user"},
 *     @OA\Response(response="default", description="Work in Progress")
 * )
 *
 * Class SignupController
 */
class SignupController extends ApiV1Controller
{

}
