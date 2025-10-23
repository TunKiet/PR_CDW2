<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{menuItemId}', [ReviewController::class, 'getAllReviews']);
Route::get('/menu/{id}/ratings', [ReviewController::class, 'getRatingStats']);

