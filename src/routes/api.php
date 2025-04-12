<?php

use App\Http\Controllers\V1\LibraryController;
use App\Http\Controllers\V1\LibraryItemController;
use App\Http\Controllers\V1\PosterController;
use App\Http\Controllers\V1\ProfileController;
use App\Http\Controllers\V1\UserController;
use App\Http\Controllers\V1\ValidationController;
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
Route::middleware(['auth'])
    ->prefix('v1/user/')->name('v1.user.')
    ->controller(UserController::class)
    ->group(function () {
        Route::post('/signup', 'signup')->name('signup')
            ->middleware(['throttle.captcha:1,360,signup']);
        Route::post('/login', 'login')->name('login')
            ->middleware(['throttle.captcha:3,120,login']);

        Route::post('/password-reset', 'requestPasswordReset')->name('requestPasswordReset')
            ->middleware(['throttle.captcha:1,360,requestPasswordReset']);
        Route::put('/password-reset', 'performPasswordReset')->name('performPasswordReset')
            ->middleware(['throttle:api.basic']);

        Route::post('/verify-email', 'requestEmailVerify')->name('requestEmailVerify')
            ->middleware(['throttle.captcha:1,30,requestEmailVerify']);
    });

// Routes for profile (as authenticated user)
Route::middleware(['auth.bearer:sanctum', 'throttle:api.basic'])
    ->prefix('v1/profile/')->name('v1.profile.')
    ->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'changePassword'])->name('changePassword');

        Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');
    });

// Routes for validation stuff
Route::middleware(['auth', 'throttle:api.validation'])
    ->prefix('v1/validation/')->name('v1.validation.')
    ->controller(ValidationController::class)
    ->group(function () {
        Route::post('/email', [ValidationController::class, 'validateUserEmail'])->name('email');
    });
Route::middleware(['auth.bearer:sanctum', 'throttle:api.validation'])
    ->prefix('v1/validation/')->name('v1.validation.')
    ->controller(ValidationController::class)
    ->group(function () {
        Route::post('/libraries', [ValidationController::class, 'validateLibraryName'])
            ->name('libraries');
        Route::post('/libraries/{id}/items', [ValidationController::class, 'validateLibraryItemName'])
            ->name('libraries.items');
    });

// Routes for Collections (CRUD)
Route::middleware(['auth.bearer:sanctum', 'throttle:api.basic'])
    ->prefix('v1/libraries/')->name('v1.libraries.')
    ->group(function () {
        Route::get('/', [LibraryController::class, 'index'])->name('index');
        Route::post('/', [LibraryController::class, 'create'])->name('create');

        Route::get('/{id}', [LibraryController::class, 'view'])->name('view');
        Route::delete('/{id}', [LibraryController::class, 'delete'])->name('delete');
        Route::patch('/{id}', [LibraryController::class, 'clear'])->name('clear');
    });

// Routes for Collection entries (CRUD)
Route::middleware(['auth.bearer:sanctum', 'throttle:api.basic'])
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

// Routes for Poster management
Route::middleware(['auth.bearer:sanctum', 'throttle:api.posters'])
    ->prefix('v1/posters/')->name('v1.posters.')
    ->controller(PosterController::class)
    ->group(function () {
        Route::get('/', 'find')->name('find');
        Route::post('/', 'upload')->name('upload');
    });
