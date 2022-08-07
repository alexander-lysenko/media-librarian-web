<?php

use App\Http\Controllers\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// User authentication, signup, email verification, reset password
Route::middleware(['api'])->prefix('v1/user/')->name('v1.user.')->group(function () {
    Route::post('/signup', [UserController::class, 'signup']);
    Route::post('/login', [UserController::class, 'login']);

    Route::get('/activate', [UserController::class, 'activate'])->name('verification.verify');
    Route::post('/password-reset', [UserController::class, 'requestPasswordReset']);
    Route::put('/password-reset', [UserController::class, 'performPasswordReset']);
});

// User authorization, logout
Route::middleware(['auth:sanctum'])->prefix('v1/user/')->name('v1.user.')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/', function (Request $request) {
        return $request->user();
    });
});

// Application routes
Route::middleware([])->prefix('v1/')->name('v1')->group(function () {
    Route::get('lib', fn() => "Hello");
});
