<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

// =======================
// 🔹 Controllers Import
// =======================
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

// 🔹 Thêm controller mới cho Order
use App\Http\Controllers\Api\OrderController;


// 🔹 (Tùy chọn) Các controller liên quan khác nếu cần
// use App\Http\Controllers\Api\TableController;
// use App\Http\Controllers\Api\MenuItemController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Tất cả route API sẽ nằm ở đây, prefix mặc định là /api
|--------------------------------------------------------------------------
*/

// ✅ Test route kiểm tra API hoạt động
Route::get('/test', function () {
    return response()->json(['message' => 'API file is loaded']);
});

/*
|--------------------------------------------------------------------------
| 🍽️ Dish & Review Routes
|--------------------------------------------------------------------------
*/
Route::apiResource('dishes', DishController::class);

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{menuItemId}', [ReviewController::class, 'index']);
Route::get('/reviews/{menuItemId}/average', [ReviewController::class, 'averageRating']);

/*
|--------------------------------------------------------------------------
| 👤 Auth Routes (JWT)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| 🛡️ Role & Permission Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt.auth'])->group(function () {
    Route::apiResource('/roles', RoleController::class);
    Route::apiResource('/permissions', PermissionController::class);
});

/*
|--------------------------------------------------------------------------
| 🧾 Order Routes (Chức năng thêm đơn hàng)
|--------------------------------------------------------------------------
|
| Controller chỉ nhận request, Model xử lý logic.
|
| - POST   /api/orders      → Tạo đơn hàng mới
| - GET    /api/orders      → (Tuỳ chọn) Lấy danh sách đơn hàng
| - GET    /api/orders/{id} → (Tuỳ chọn) Lấy chi tiết đơn hàng
|
*/
// Route::prefix('orders')->group(function () {
//     Route::post('/', [OrderController::class, 'store'])->name('orders.store');
//     Route::get('/', [OrderController::class, 'index'])->name('orders.index');
//     Route::get('/{order_id}', [OrderController::class, 'show'])->name('orders.show');
// });
// Route::get('/orders', [OrderController::class, 'index']);

use App\Http\Controllers\Api\MenuItemController;


Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
use App\Http\Controllers\Api\CategoryController;


Route::get('/categories', [CategoryController::class, 'index']);

