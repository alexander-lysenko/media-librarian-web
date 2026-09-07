<?php

use App\Http\Controllers\PosterController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

$forwardToSinglePage = static function () {
    return view('index');
};

Route::middleware(['throttle:web']) //
->group(function () use ($forwardToSinglePage) {
    Route::get('/', $forwardToSinglePage)
        ->name('index');
    Route::get('/app', $forwardToSinglePage)
        ->name('app');
    Route::get('/login', $forwardToSinglePage)
        ->name('login');
    Route::get('/signup', $forwardToSinglePage)
        ->name('signup');
    Route::get('/profile', $forwardToSinglePage)
        ->name('profile');
});

Route::middleware(['throttle:web', /*'signed:relative'*/]) // todo: manage correct middleware
->group(function () {
    Route::get('/email-confirmation', [WebController::class, 'emailVerify'])
        ->name('verification.verify');
    Route::get('/password-reset', [WebController::class, 'resetPasswordForm'])
        ->name('password.reset');
});

Route::middleware(['throttle:web']) //
->group(function () {
    Route::get('/email-confirmation-preview', [WebController::class, 'previewVerifyEmail']);
    Route::get('/password-reset-preview', [WebController::class, 'previewPasswordResetEmail']);
});


Route::middleware(['throttle:web']) //
->group(static function () {
    Route::get('/posters/{uuid}', [PosterController::class, 'generateCloudUrl'])
        ->name('posters.cloudLink');
});
