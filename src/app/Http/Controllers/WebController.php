<?php

namespace App\Http\Controllers;

use App\Mail\UserVerify;
use Illuminate\Http\Request;

class WebController extends Controller
{
    /**
     * TODO: REWORK THAT
     * @return string
     */
    public function emailVerify(Request $request): mixed
    {
        // ddd($request->user());
        return new UserVerify();
        return "Ok";
    }
}
