<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmAddress;
use App\Mail\PasswordReset;
use Illuminate\Http\Request;

class WebController extends Controller
{
    /**
     * TODO: this is temporary
     * @param Request $request
     * @return mixed
     */
    public function emailVerify(Request $request): mixed
    {
        // if (!$request->hasValidSignature()) {
        //     abort(401);
        // }
        // ddd($request->user());
        $email = new ConfirmAddress(username: $request->user()?->name ?? 'user', token: '123');
        return $email;
    }

    /**
     * TODO: this is temporary
     * @param Request $request
     * @return mixed
     */
    public function resetPassword(Request $request): mixed
    {
        // if (!$request->hasValidSignature()) {
        //     abort(401);
        // }
        $email = new PasswordReset(username: $request->user()?->name ?? 'user', email: 'john.doe@example.com', token: '123');
        return $email;
    }
}
