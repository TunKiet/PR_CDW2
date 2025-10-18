<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{menuItemId}', [ReviewController::class, 'index']);

Route::get('/reviews/{menuItemId}/average', [ReviewController::class, 'averageRating']);
