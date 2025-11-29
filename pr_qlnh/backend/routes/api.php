<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 🔹 Import Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginLogController;
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\CategoryIngredientController;

use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\Api\PaymentController;

use App\Http\Controllers\Api\PreOrderController;

// Online Order (Frontend)
use App\Http\Controllers\Api\OrderOnlineController;

// Online Order (Admin)
use App\Http\Controllers\Api\OrderOnlineAdminController;

// Attendance (Chấm công)
use App\Http\Controllers\AttendanceController;


/*
|--------------------------------------------------------------------------
| 🔥 Test API
|--------------------------------------------------------------------------
*/
Route::get('/test', fn() => response()->json(['message' => 'API loaded']));


/*
|--------------------------------------------------------------------------
| 🍽️ Dish & Review
|--------------------------------------------------------------------------
*/
Route::apiResource('dishes', DishController::class);

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{menuItemId}', [ReviewController::class, 'index']);
Route::get('/reviews/{menuItemId}/average', [ReviewController::class, 'averageRating']);


/*
|--------------------------------------------------------------------------
| 🧂 Ingredients
|--------------------------------------------------------------------------
*/
Route::get('/ingredients', [IngredientController::class, 'getAllIngredient']);
Route::post('/ingredients', [IngredientController::class, 'store']);
Route::put('/ingredients/{id}', [IngredientController::class, 'update']);
Route::delete('/ingredients/delete/{id}', [IngredientController::class, 'destroy']);
Route::get('/ingredients/filter/{categoryId}', [IngredientController::class, 'filterCategory']);
Route::get('/alert', [IngredientController::class, 'alertIngredient']);
Route::get('/export', [IngredientController::class, 'exportPDF']);

Route::get('/category-ingredient', [CategoryIngredientController::class, 'getAllCategoryIngredient']);


/*
|--------------------------------------------------------------------------
| 👤 Auth (JWT)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-login-otp', [AuthController::class, 'verifyLoginOTP']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Login Logs
    Route::get('/login-logs', [LoginLogController::class, 'getUserLogs']);
});


/*
|--------------------------------------------------------------------------
| 🛡️ Roles & Permissions
|--------------------------------------------------------------------------
*/
Route::prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::get('/{id}', [RoleController::class, 'show']);
    Route::post('/', [RoleController::class, 'store']);
    Route::put('/{id}', [RoleController::class, 'update']);
    Route::delete('/{id}', [RoleController::class, 'destroy']);
    Route::post('/{id}/permissions', [RoleController::class, 'assignPermissions']);
    Route::get('/{id}/users', [RoleController::class, 'getUsersByRole']);
});

Route::prefix('permissions')->group(function () {
    Route::get('/', [PermissionController::class, 'index']);
    Route::get('/{id}', [PermissionController::class, 'show']);
    Route::post('/', [PermissionController::class, 'store']);
    Route::put('/{id}', [PermissionController::class, 'update']);
    Route::delete('/{id}', [PermissionController::class, 'destroy']);
    Route::get('/{id}/roles', [PermissionController::class, 'getRolesByPermission']);
});
/**
 * User Management
 */
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/del/{id}', [UserController::class, 'destroy']);
    Route::get('/role-names/{id}', [UserController::class, 'getRoleNames']);
});

/*
|--------------------------------------------------------------------------
| 🔐 Password Reset
|--------------------------------------------------------------------------
*/
Route::post('/password/forgot', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
Route::post('/password/reset', [ForgotPasswordController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| 🔒 Two-Factor Authentication (2FA)
|--------------------------------------------------------------------------
*/
Route::prefix('2fa')->group(function () {
    Route::post('/send-otp/{userId}', [App\Http\Controllers\TwoFactorController::class, 'sendOTP']);
    Route::post('/verify-otp/{userId}', [App\Http\Controllers\TwoFactorController::class, 'verifyOTP']);
    Route::post('/disable/{userId}', [App\Http\Controllers\TwoFactorController::class, 'disable2FA']);
    Route::get('/status/{userId}', [App\Http\Controllers\TwoFactorController::class, 'check2FAStatus']);
});


/*
|--------------------------------------------------------------------------
| 🛒 MENU & TABLE
|--------------------------------------------------------------------------
*/
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/tables', [TableController::class, 'index']);


/*
|--------------------------------------------------------------------------
| 👤 Customers
|--------------------------------------------------------------------------
*/
Route::prefix('customers')->group(function () {
    Route::get('/', [CustomerController::class, 'index']);
    Route::post('/', [CustomerController::class, 'store']);
    Route::put('/{id}', [CustomerController::class, 'update']);
    Route::delete('/{id}', [CustomerController::class, 'destroy']);
    Route::get('/search', [CustomerController::class, 'search']);
});


/*
|--------------------------------------------------------------------------
| 🧾 Orders (Ăn tại nhà hàng)
|--------------------------------------------------------------------------
*/
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::post('/', [OrderController::class, 'store']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});

Route::get('/menu', [OrderController::class, 'menu']);


/*
|--------------------------------------------------------------------------
| 📦 Pre-Order (Đặt trước)
|--------------------------------------------------------------------------
*/
Route::get('/pre-orders', [PreOrderController::class, 'index']);
Route::get('/pre-order-details/{id}', [PreOrderController::class, 'showDetails']);
Route::put('/pre-orders/{id}/status', [PreOrderController::class, 'updateStatus']);


/*
|--------------------------------------------------------------------------
| 💳 Payments
|--------------------------------------------------------------------------
*/
Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::post('/', [PaymentController::class, 'store']);
});


/*
|--------------------------------------------------------------------------
| 🛍️ ORDER ONLINE (Frontend Website)
|--------------------------------------------------------------------------
*/
Route::post('/order-online', [OrderOnlineController::class, 'store']);
Route::get('/order-online', [OrderOnlineController::class, 'index']);
Route::get('/order-online/{id}', [OrderOnlineController::class, 'show']);
Route::put('/order-online/{id}', [OrderOnlineController::class, 'update']);


/*
|--------------------------------------------------------------------------
| 🛒 ORDER ONLINE ADMIN
|--------------------------------------------------------------------------
*/
Route::get('/admin/order-online', [OrderOnlineAdminController::class, 'index']);
Route::get('/admin/order-online/{id}', [OrderOnlineAdminController::class, 'show']);
Route::put('/admin/order-online/{id}', [OrderOnlineAdminController::class, 'updateStatus']);


/*
|--------------------------------------------------------------------------
| ⏰ ATTENDANCE (Chấm công)
|--------------------------------------------------------------------------
*/
// Chấm công cho nhân viên
Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
Route::post('/attendance/today-status', [AttendanceController::class, 'getTodayStatus']);

// Xem chấm công của nhân viên
Route::get('/attendance/monthly', [AttendanceController::class, 'getMonthlyAttendance']);
Route::get('/attendance/weekly', [AttendanceController::class, 'getWeeklyHours']);

// Quản lý chấm công (Admin/Manager)
Route::prefix('attendance')->group(function () {
    Route::get('/', [AttendanceController::class, 'index']); // Lấy tất cả
    Route::get('/report', [AttendanceController::class, 'getReport']); // Báo cáo tổng hợp
    Route::get('/{id}', [AttendanceController::class, 'show']); // Chi tiết
    Route::post('/', [AttendanceController::class, 'store']); // Tạo mới
    Route::put('/{id}', [AttendanceController::class, 'update']); // Cập nhật
    Route::delete('/{id}', [AttendanceController::class, 'destroy']); // Xóa
});

