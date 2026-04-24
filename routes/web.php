<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'layer' => 'backend-api',
        'status' => 'ok',
        'documentation' => 'docs/architecture.md',
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),
    ]);
});
