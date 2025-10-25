<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{menuItemId}', [ReviewController::class, 'getThreeReview']);
Route::get('/menu/{id}/ratings', [ReviewController::class, 'getRatingStats']);
Route::get('/reviews/{menuItemId}/all', [ReviewController::class, 'getAllReviews']);
Route::get('/reviews/{menuItemId}', [ReviewController::class, 'getAllReviews']);

