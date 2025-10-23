<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DishController;

Route::get('/test', function () {
    return response()->json(['message' => 'API file is loaded']);
});

// ✅ Đây là route chính cho DishController
Route::apiResource('dishes', DishController::class);
