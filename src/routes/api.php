<?php

use App\Http\Controllers\Api\UnsplashApiController;
use App\Http\Controllers\Api\V1\LibraryController;
use App\Http\Controllers\Api\V1\LibraryItemController;
use App\Http\Controllers\Api\V1\PosterController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ValidationController;
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
    ->group(function () {
        Route::post('/signup', [UserController::class, 'signup'])
            ->name('signup')
            ->middleware(['throttle.captcha:1,360,signup']);
        Route::post('/login', [UserController::class, 'login'])
            ->name('login')
            ->middleware(['throttle.captcha:3,120,login']);

        Route::post('/password-reset', [UserController::class, 'requestPasswordReset'])
            ->name('requestPasswordReset')
            ->middleware(['throttle.captcha:1,360,requestPasswordReset']);
        Route::put('/password-reset', [UserController::class, 'performPasswordReset'])
            ->name('performPasswordReset')
            ->middleware(['throttle:api.basic']);

        Route::post('/verify-email', [UserController::class, 'requestEmailVerify'])
            ->name('requestEmailVerify')
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
    ->prefix('v1/validations/')->name('v1.validation.')
    ->group(function () {
        Route::post('/email', [ValidationController::class, 'validateUserEmail'])->name('email');
    });
Route::middleware(['auth.bearer:sanctum', 'throttle:api.validation'])
    ->prefix('v1/validations/')->name('v1.validation.')
    ->group(function () {
        Route::post('/libraries', [ValidationController::class, 'validateLibraryName'])
            ->name('libraries');
        Route::post('/libraries/{id}/items', [ValidationController::class, 'validateLibraryItemName'])
            ->whereNumber('id')
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
    })
    ->whereNumber('id');

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
    })
    ->whereNumber('id')
    ->whereNumber('item');

// Routes for Poster management
Route::middleware(['auth.bearer:sanctum', 'throttle:api.posters'])
    ->prefix('v1/posters/')->name('v1.posters.')
    ->group(function () {
        Route::get('/', [PosterController::class, 'find'])->name('find');
        Route::post('/', [PosterController::class, 'upload'])->name('upload');
    });

// Routes for Unsplash API
Route::middleware(['throttle:api.basic'])
    ->prefix('unsplash/')->name('unsplash.')
    ->group(function () {
        Route::get('/image/{id}', [UnsplashApiController::class, 'getImage'])
            ->where('id', '[\w]+')
            ->name('image');
        Route::get('/random', [UnsplashApiController::class, 'randomImage'])
            ->name('random');
    });
