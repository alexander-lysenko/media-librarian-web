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
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which is assigned the "api" middleware group.
| Enjoy building your API!
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

// Routes for profile (as authenticated user)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/profile/')->name('v1.profile.')
    ->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/change-password', [ProfileController::class, 'changePassword'])->name('changePassword');

        Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');
    });

// Routes for Collections (CRUD)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/collections/')->name('v1.collections.')
    ->group(function () {
        Route::get('/', [CollectionController::class, 'index'])->name('index');
        Route::post('/', [CollectionController::class, 'create'])->name('create');

        Route::get('/{id}', [CollectionController::class, 'view'])->name('view');
        Route::delete('/{id}', [CollectionController::class, 'delete'])->name('delete');
        Route::patch('/{id}', [CollectionController::class, 'clear'])->name('clear');
    });

// Routes for Collection entries (CRUD)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/collections/{id}/entries/')->name('v1.collections.entries.')
    ->group(function () {
        Route::get('/', [CollectionEntryController::class, 'index'])->name('index');
        Route::post('/', [CollectionEntryController::class, 'create'])->name('create');

        Route::get('/{entry}', [CollectionEntryController::class, 'view'])->name('view');
        Route::put('/{entry}', [CollectionEntryController::class, 'update'])->name('update');
        Route::delete('/{entry}', [CollectionEntryController::class, 'delete'])->name('delete');

        Route::get('/random', [CollectionEntryController::class, 'random'])->name('random');
    });
