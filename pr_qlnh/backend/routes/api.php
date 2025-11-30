<?php

use App\Http\Controllers\IngredientController;
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
use App\Http\Controllers\ForgotPasswordController;

// 🔹 Thêm controller mới cho Order
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\MenuItemController;


Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\CategoryIngredientController;
use App\Models\Ingredient;
use App\Http\Controllers\Api\PreOrderController;
//Table
use App\Http\Controllers\API\TableController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\ReservationManagementController;
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
Route::get('/ingredients', [IngredientController::class, 'getAllIngredient']);
Route::put('/ingredients/{id}', [IngredientController::class, 'update']);
Route::post('/add', [IngredientController::class, 'store']);
Route::get('/category-ingredient', [CategoryIngredientController::class, 'getAllCategoryIngredient']);
Route::delete('ingredients/delete/{id}', [IngredientController::class, 'destroy']);
Route::get('/export', [IngredientController::class, 'exportPDF']);
Route::get('/ingredients/filter/{categoryId}', [IngredientController::class, 'filterCategory']);
Route::get('/alert', [IngredientController::class, 'alertIngredient']);


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

Route::post('/password/forgot', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
Route::post('/password/reset', [ForgotPasswordController::class, 'resetPassword']);

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


Route::get('/categories', [CategoryController::class, 'index']);


Route::get('/pre-orders', [PreOrderController::class, 'index']);
Route::get('/pre-order-details/{id}', [PreOrderController::class, 'showDetails']);
Route::put('/pre-orders/{id}/status', [PreOrderController::class, 'updateStatus']);


//Table
Route::apiResource('tables', TableController::class);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::prefix('reservation-management')->group(function () {

    Route::get('/', [ReservationManagementController::class, 'index']);        // lấy danh sách + filter
    Route::get('/{id}', [ReservationManagementController::class, 'show']);      // chi tiết đơn

    Route::put('/{id}/status', [ReservationManagementController::class, 'updateStatus']); // cập nhật trạng thái
    Route::put('/{id}/cancel', [ReservationManagementController::class, 'cancel']);       // hủy đơn

    Route::delete('/{id}', [ReservationManagementController::class, 'destroy']);          // xóa đơn
});
Route::get('/floorplan', [TableController::class, 'floorplan']);
Route::put('/tables/{id}/status', [TableController::class, 'updateStatus']);


//login mới được đặt bàn
//Route::middleware('auth:sanctum')->post('/reservations', [ReservationController::class, 'store']);

// Route::get('/tables', [TableController::class, 'index']);
// Route::post('/tables', [TableController::class, 'store']);
// Route::put('/tables/{id}', [TableController::class, 'update']);
// Route::delete('/tables/{id}', [TableController::class, 'destroy']);
