<?php

use App\Http\Controllers\V1\ProfileController;
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
Route::middleware(['guest'])->prefix('v1/user/')->name('v1.user.')->group(function () {
    Route::post('/signup', [UserController::class, 'signup'])->name('signup');
    Route::post('/login', [UserController::class, 'login'])->name('login');

    Route::post('/password-reset', [UserController::class, 'requestPasswordReset']);
    Route::put('/password-reset', [UserController::class, 'performPasswordReset']);

    Route::post('/verify-email', [UserController::class, 'requestEmailVerify'])->name('requestEmailVerify');
    Route::get('/verify-email', [UserController::class, 'performEmailVerify'])->name('emailVerify');
});

// User authorization, logout
Route::middleware(['auth.bearer:sanctum'])->prefix('v1/profile/')->name('v1.profile.')->group(function () {
    Route::get('/', [ProfileController::class, 'profile'])->name('profile');
    // Route::put('/', [])->name('');
    // Route::get('/change-email', [])->name('');
    // Route::get('/change-password', [])->name('');
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
});

// Application routes
Route::middleware(['auth.bearer:sanctum'])->prefix('v1/')->name('v1')->group(function () {
    Route::get('/libraries', fn() => "View Libraries");
    Route::post('/libraries/create', fn() => "Create a Library");
    Route::delete('/libraries/{id}', fn() => "Delete a Library");
    Route::put('/library/{id}/clear', fn() => "Clear the selected Library");
    Route::get('/library/{id}', fn() => "View entries in the selected Library");
    Route::post('/library/{id}/add', fn() => "Add an entry to the selected Library");
    Route::put('/library/{id}/entry/{eid}', fn() => "Update an entry in the selected Library");
    Route::delete('/library/{id}/entry/{eid}', fn() => "Remove/Delete an entry from the selected Library");
    Route::get('/library/{id}/entry/random', fn() => "Get a random entry from the selected Library");
});
