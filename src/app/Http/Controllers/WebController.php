<?php

namespace App\Http\Controllers;

use App\Models\EmailConfirmation;
use App\Models\PasswordReset;
use Illuminate\Contracts\View\View as ViewContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class WebController extends Controller
{
    /**
     * Processes confirmation/verification of user's email address
     *
     * @param Request $request
     * @return ViewContract
     * @noinspection PhpRedundantCatchClauseInspection
     */
    public function emailVerify(Request $request): ViewContract
    {
        try {
            $request->validate([
                'email' => ['required', 'email'],
                'token' => ['required', 'string', 'size:64'],
            ]);
        } catch (ValidationException $exception) {
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }

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
     * @noinspection PhpRedundantCatchClauseInspection
     */
    public function resetPasswordForm(Request $request): ViewContract
    {
        try {
            $request->validate([
                'email' => ['required', 'email'],
                'token' => ['required', 'string', 'size:64'],
            ]);
        } catch (ValidationException $exception) {
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }

        PasswordReset::query()
            ->where('email', $request->input('email'))
            ->where('token', $request->input('token'))
            ->firstOr(function () {
                throw new UnprocessableEntityHttpException('validation.token.expired');
            });

        return View::make('index');
    }
}
