<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/test-api', function() {
    return 'API is working';
});