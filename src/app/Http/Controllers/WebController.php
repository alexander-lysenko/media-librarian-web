<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmAddress;
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
        $email = new ConfirmAddress(username: $request->user()?->name ?? 'user', token: '123');
        return $email;
    }
}
