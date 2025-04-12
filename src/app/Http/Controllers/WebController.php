<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmAddressMailable;
use App\Mail\ResetPasswordMailable;
use App\Models\EmailConfirmation;
use App\Models\PasswordReset;
use Illuminate\Contracts\Mail\Mailable as MailableContract;
use Illuminate\Contracts\View\View as ViewContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class WebController extends Controller
{
    /**
     * Processes confirmation/verification of user's email address
     *
     * @param Request $request
     * @return ViewContract
     */
    public function emailVerify(Request $request): ViewContract
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string', 'size:64'],
        ]);

        $confirmationEntry = EmailConfirmation::query()
            ->where('email', $request->input('email'))
            ->where('token', $request->input('token'))
            ->firstOr(function () {
                throw new UnprocessableEntityHttpException('validation.token.expired');
            });

        $user = $confirmationEntry->user;
        $user->forceFill(['email' => strtolower($request->input('email'))]);
        $user->markEmailAsVerified();

        EmailConfirmation::query()->where('user_id', $user->id)->delete();

        return View::make('verified');
    }

    /**
     * Validates password reset token and navigates to password reset dialog
     *
     * @param Request $request
     * @return ViewContract
     */
    public function resetPasswordForm(Request $request): ViewContract
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string', 'size:64'],
        ]);

        PasswordReset::query()
            ->where('email', $request->input('email'))
            ->where('token', $request->input('token'))
            ->firstOr(function () {
                throw new UnprocessableEntityHttpException('validation.token.expired');
            });

        return View::make('index');
    }

    public function previewVerifyEmail(Request $request): MailableContract
    {
        $request->validate([
            'username' => ['string'],
            'email' => ['email'],
            'token' => ['string', 'max:64'],
            'locale' => ['string', 'in:ru,en'],
        ]);

        $email = new ConfirmAddressMailable(
            username: $request->input('username') ?: 'John Doe',
            email: $request->input('email') ?: 'john.doe@example.com',
            token: $request->input('token')
                ?: '0000000000000000000000000000000000000000000000000000000000000000'
        );

        return $email->locale($request->input('locale') ?: 'en');
    }

    public function previewPasswordResetEmail(Request $request): MailableContract
    {
        $request->validate([
            'username' => ['string'],
            'email' => ['email'],
            'token' => ['string', 'max:64'],
            'locale' => ['string', 'in:ru,en'],
        ]);

        $email = new ResetPasswordMailable(
            username: $request->input('username') ?: 'John Doe',
            email: $request->input('email') ?: 'john.doe@example.com',
            token: $request->input('token')
                ?: '0000000000000000000000000000000000000000000000000000000000000000'
        );

        return $email->locale($request->input('locale') ?: 'en');
    }
}
