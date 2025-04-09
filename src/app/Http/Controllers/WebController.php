<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmAddressMailable;
use App\Mail\ResetPasswordMailable;
use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
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
        $email = new ConfirmAddressMailable(
            username: $request->user()?->name ?? 'user',
            token: '123'
        );
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
        $email = new ResetPasswordMailable(
            username: $request->user()?->name ?? 'user',
            email: 'john.doe@example.com',
            token: '123'
        );
        return $email;
    }
}
