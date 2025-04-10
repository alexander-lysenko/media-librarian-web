<?php

namespace App\Http\Controllers;

use App\Models\EmailConfirmation;
use App\Models\PasswordReset;
use App\Utils\Enum\UserStatusEnum;
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
                throw new UnprocessableEntityHttpException(trans('validation.token.expired'));
            });

        $user = $confirmationEntry->user;
        if ($user->status === UserStatusEnum::CREATED->value) {
            $user->forceFill([
                'status' => UserStatusEnum::ACTIVE->value,
            ]);
        }
        $user->forceFill([
            'email' => strtolower($request->input('email')),
            'email_verified_at' => now(),
        ])->save();

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
    public function resetPassword(Request $request): ViewContract
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
                throw new UnprocessableEntityHttpException(trans('validation.token.expired'));
            });

        return View::make('index');
    }
}
