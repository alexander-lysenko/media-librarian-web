<?php

use App\Http\Controllers\V1\LibraryController;
use App\Http\Controllers\V1\LibraryItemController;
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
    ->prefix('v1/libraries/')->name('v1.libraries.')
    ->group(function () {
        Route::get('/', [LibraryController::class, 'index'])->name('index');
        Route::post('/', [LibraryController::class, 'create'])->name('create');

        Route::get('/{id}', [LibraryController::class, 'view'])->name('view');
        Route::delete('/{id}', [LibraryController::class, 'delete'])->name('delete');
        Route::patch('/{id}', [LibraryController::class, 'clear'])->name('clear');
    });

// Routes for Collection entries (CRUD)
Route::middleware(['auth.bearer:sanctum'])
    ->prefix('v1/libraries/{id}/items/')->name('v1.libraries.items.')
    ->group(function () {
        Route::get('/', [LibraryItemController::class, 'index'])->name('index');
        Route::post('/', [LibraryItemController::class, 'create'])->name('create');

        Route::get('/{item}', [LibraryItemController::class, 'view'])->name('view');
        Route::put('/{item}', [LibraryItemController::class, 'update'])->name('update');
        Route::delete('/{item}', [LibraryItemController::class, 'delete'])->name('delete');

        Route::post('/search', [LibraryItemController::class, 'search'])->name('search');
        Route::get('/random', [LibraryItemController::class, 'random'])->name('random');
    });
