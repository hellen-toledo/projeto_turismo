<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminCityController;
use App\Http\Controllers\Api\AdminEventController;
use App\Http\Controllers\Api\AdminInterestTagController;
use App\Http\Controllers\Api\AdminMediaController;
use App\Http\Controllers\Api\AdminRegionController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\InterestTagController;
use App\Http\Controllers\Api\RegionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::get('/regions', [RegionController::class, 'index'])->name('regions.index');
    Route::get('/cities', [CityController::class, 'index'])->name('cities.index');
    Route::get('/cities/{idOrSlug}', [CityController::class, 'show'])->name('cities.show');
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/{idOrSlug}', [EventController::class, 'show'])->name('events.show');
    Route::get('/interest-tags', [InterestTagController::class, 'index'])->name('interest-tags.index');

    Route::prefix('admin')->name('admin.')->group(function (): void {
        Route::post('/auth/login', [AdminAuthController::class, 'login'])
            ->middleware('throttle:admin-login')
            ->name('auth.login');

        Route::middleware(['auth:sanctum', 'can:access-admin'])->group(function (): void {
            Route::get('/auth/me', [AdminAuthController::class, 'me'])->name('auth.me');
            Route::post('/auth/logout', [AdminAuthController::class, 'logout'])->name('auth.logout');

            Route::apiResource('cities', AdminCityController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
            Route::apiResource('events', AdminEventController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::apiResource('regions', AdminRegionController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::apiResource('media', AdminMediaController::class)
                ->parameters(['media' => 'media'])
                ->only(['index', 'store', 'destroy']);
            Route::apiResource('interest-tags', AdminInterestTagController::class)
                ->parameters(['interest-tags' => 'interestTag'])
                ->only(['index', 'store', 'update', 'destroy']);
        });
    });
});

/*
// Deprecated public aliases kept temporarily for backward compatibility with pre-v1 clients.
Route::get('/regions', [RegionController::class, 'index'])->name('api.regions.index');
Route::get('/cities', [CityController::class, 'index'])->name('api.cities.index');
Route::get('/cities/{idOrSlug}', [CityController::class, 'show'])->name('api.cities.show');
Route::get('/events', [EventController::class, 'index'])->name('api.events.index');
Route::get('/events/{idOrSlug}', [EventController::class, 'show'])->name('api.events.show');
Route::get('/interest-tags', [InterestTagController::class, 'index'])->name('api.interest-tags.index');
Route::get('/cidades', [CityController::class, 'index'])->name('api.cidades.index');
Route::get('/cidades/{idOrSlug}', [CityController::class, 'show'])->name('api.cidades.show');
Route::get('/eventos', [EventController::class, 'index'])->name('api.eventos.index');
Route::get('/eventos/{idOrSlug}', [EventController::class, 'show'])->name('api.eventos.show');

// Deprecated admin aliases kept temporarily while legacy clients migrate to /api/v1/admin/*.
Route::prefix('admin/v1')->name('api.admin.legacy.v1.')->group(function (): void {
    Route::post('/auth/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:admin-login')
        ->name('auth.login');

    Route::middleware(['auth:sanctum', 'can:access-admin'])->group(function (): void {
        Route::get('/auth/me', [AdminAuthController::class, 'me'])->name('auth.me');
        Route::post('/auth/logout', [AdminAuthController::class, 'logout'])->name('auth.logout');

        Route::apiResource('cities', AdminCityController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('events', AdminEventController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('regions', AdminRegionController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('interest-tags', AdminInterestTagController::class)
            ->parameters(['interest-tags' => 'interestTag'])
            ->only(['index', 'store', 'update', 'destroy']);
    });
});
*/
