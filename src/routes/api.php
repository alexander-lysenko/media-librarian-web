<?php

use App\Http\Controllers\V1\CollectionController;
use App\Http\Controllers\V1\CollectionEntryController;
use App\Http\Controllers\V1\ProfileController;
use App\Http\Controllers\V1\UserController;
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

// User authentication, guest routes (unauthenticated user)
Route::middleware(['guest'])
    ->prefix('v1/user/')->name('v1.user.')
    ->controller(UserController::class)
    ->group(function () {
        Route::post('/signup', 'signup')->name('signup');
        Route::post('/login', 'login')->name('login');

        Route::post('/password-reset', 'requestPasswordReset')->name('requestPasswordReset');
        Route::put('/password-reset', 'performPasswordReset')->name('performPasswordReset');

        Route::post('/verify-email', 'requestEmailVerify')->name('requestEmailVerify');
        Route::get('/verify-email', 'performEmailVerify')->name('emailVerify');
    });

// Profile routes (authenticated user)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/profile/')->name('v1.profile.')
    ->controller(ProfileController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::put('/update', 'update')->name('update');
        Route::put('/change-password', 'changePassword')->name('changePassword');

        Route::post('/logout', 'logout')->name('logout');
    });

// Collection routes (CRUD)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/collection/')->name('v1.collection.')
    ->controller(CollectionController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/create', 'create');

        Route::get('/{id}', 'view');
        Route::delete('/{id}', 'delete');

        Route::post('/{id}/clear', 'clear');
    });

// Collection entry routes (CRUD)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/collection/{id}/entry/')->name('v1.collectionEntry.')
    ->controller(CollectionEntryController::class)
    ->group(function () {
        Route::post('/add', 'create');

        Route::get('/{entry}', 'view');
        Route::put('/{entry}', 'update');
        Route::delete('/{entry}', 'delete');

        Route::get('/random', 'random');
    });

Route::middleware(['auth.bearer:sanctum'])->get("v1/test", [\App\Http\Controllers\V1\TestController::class, 'test']);
