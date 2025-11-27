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
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\CategoryIngredientController;

use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PaymentController;

use App\Http\Controllers\Api\PreOrderController;

// Online Order (Frontend)
use App\Http\Controllers\Api\OrderOnlineController;

// Online Order (Admin)
use App\Http\Controllers\Api\OrderOnlineAdminController;


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
Route::post('/add', [IngredientController::class, 'store']);
Route::get('/category-ingredient', [CategoryIngredientController::class, 'getAllCategoryIngredient']);
Route::delete('ingredients/delete/{id}', [IngredientController::class, 'destroy']);
Route::get('/export', [IngredientController::class, 'exportPDF']);
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

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


/*
|--------------------------------------------------------------------------
| 🛡️ Roles & Permissions
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt.auth'])->group(function () {
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
    });

    Route::apiResource('permissions', PermissionController::class);
});
/**
 * User Management
 */
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
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
    Route::get('/search', [CustomerController::class, 'search']);
    Route::get('/', [CustomerController::class, 'index']);
    Route::post('/', [CustomerController::class, 'store']);
    Route::put('/{id}', [CustomerController::class, 'update']);
    Route::delete('/{id}', [CustomerController::class, 'destroy']);
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

//Menu
Route::get('/menu', [OrderController::class, 'menu']); // lấy menu

 //12/11/2025
// Route::get('/customers', [OrderController::class, 'customers']); // lấy danh sách KH
// Route::get('/customers/search', [CustomerController::class, 'search']);   

// Payments
// Route::get('/payments', [PaymentController::class, 'index']);
// Route::get('/payments/{id}', [PaymentController::class, 'show']);
// Route::post('/payments', [PaymentController::class, 'store']);
Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::post('/', [PaymentController::class, 'store']);
});
// Promotions
// use App\Http\Controllers\PromotionController;
// Route::get('/promotions', [PromotionController::class, 'index']);
// Route::get('/promotions/{id}', [PromotionController::class, 'show']);
// Route::post('/promotions', [PromotionController::class, 'store']);
// Route::put('/promotions/{id}', [PromotionController::class, 'update']);
// Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);
// Route::post('/promotions/validate', [PromotionController::class, 'validateCode']);
Route::get('/menu', [OrderController::class, 'menu']);


// /*
// |--------------------------------------------------------------------------
// | 📦 Pre-Order (Đặt trước)
// |--------------------------------------------------------------------------
// */
// Route::get('/pre-orders', [PreOrderController::class, 'index']);
// Route::get('/pre-order-details/{id}', [PreOrderController::class, 'showDetails']);
// Route::put('/pre-orders/{id}/status', [PreOrderController::class, 'updateStatus']);

Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);

// hao chuc nang

use App\Http\Controllers\Api\PromotionController;
// Protected routes (cần authentication - thêm middleware 'auth:sanctum' khi đã setup)
Route::prefix('v1')->group(function () {
    
    // CRUD Promotion routes
    Route::apiResource('promotions', PromotionController::class);
    
    // Additional promotion routes
    Route::post('/promotions/{id}/apply', [PromotionController::class, 'apply']);
    // Public routes for homepage
    Route::get('/featured-dishes', [DishController::class, 'getFeatured']);
    Route::get('/active-promotions', [PromotionController::class, 'getActive']);
    
});
// routes/api.php

use App\Http\Controllers\Api\StatisticController;

// ⭐ STATISTICS ROUTES
Route::prefix('statistics')->group(function () {
    Route::get('/dashboard', [StatisticController::class, 'dashboard']);
    Route::get('/revenue-chart', [StatisticController::class, 'revenueChart']);
    Route::get('/top-dishes', [StatisticController::class, 'topDishes']);
    Route::get('/comparison', [StatisticController::class, 'comparison']);
    Route::get('/top-customers', [StatisticController::class, 'topCustomers']);
    Route::get('/summary', [StatisticController::class, 'summary']); // Bonus
});

Route::apiResource('dishes', DishController::class);
// ⭐ THÊM ROUTES MỚI CHO STATUS MANAGEMENT
Route::prefix('dishes')->group(function () {
    // Toggle status đơn lẻ
    Route::patch('/{id}/status', [DishController::class, 'updateStatus']);
    
    // Cập nhật hàng loạt
    Route::post('/bulk-update-status', [DishController::class, 'bulkUpdateStatus']);
    
    // Lịch sử thay đổi
    Route::get('/{id}/status-history', [DishController::class, 'getStatusHistory']);
    
    // Thống kê
    Route::get('/status-stats', [DishController::class, 'getStatusStats']);
    
    // Món sắp hết
    Route::get('/low-stock', [DishController::class, 'getLowStock']);
    
    // Lọc nâng cao
    Route::get('/filter', [DishController::class, 'filter']);
});
Route::apiResource('categories', CategoryController::class);

//Table
Route::apiResource('tables', TableController::class);
Route::post('/reservations', [ReservationController::class, 'store']);
//login mới được đặt bàn
//Route::middleware('auth:sanctum')->post('/reservations', [ReservationController::class, 'store']);

// Route::get('/tables', [TableController::class, 'index']);
// Route::post('/tables', [TableController::class, 'store']);
// Route::put('/tables/{id}', [TableController::class, 'update']);
// Route::delete('/tables/{id}', [TableController::class, 'destroy']);

//Payments
Route::post('/payments', [PaymentController::class, 'store']);


Route::post('/order-online', [OrderOnlineController::class, 'store']);
Route::get('/order-online', [OrderOnlineController::class, 'index']);
Route::get('/order-online/{id}', [OrderOnlineController::class, 'show']);
Route::put('/order-online/{id}', [OrderOnlineController::class, 'update']);

Route::get('/admin/order-online', [OrderOnlineAdminController::class, 'index']);
Route::get('/admin/order-online/{id}', [OrderOnlineAdminController::class, 'show']);
Route::put('/admin/order-online/{id}', [OrderOnlineAdminController::class, 'updateStatus']);
