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
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PreOrderController;

use App\Http\Controllers\Api\OrderOnlineController;
use App\Http\Controllers\Api\OrderOnlineAdminController;

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AttendanceReportController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RestaurantInfoController;
use App\Http\Controllers\PurchaseOrderController;
use App\Models\Ingredient;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReviewReplyController;
use App\Models\Review;
use App\Models\ReviewReply;

/*
|--------------------------------------------------------------------------
| 🔥 Test API
|--------------------------------------------------------------------------
*/
Route::get('/test', fn () => response()->json(['message' => 'API loaded']));

/*
|--------------------------------------------------------------------------
| 🍽️ Dishes & Reviews
|--------------------------------------------------------------------------
*/
Route::apiResource('dishes', DishController::class);

Route::prefix('reviews')->group(function () {
    Route::post('/', [ReviewController::class, 'store']);
    // Route::get('/{menuItemId}', [ReviewController::class, 'index']);
    Route::get('/{menuItemId}/average', [ReviewController::class, 'averageRating']);

    // Additional review features
    Route::get('/all-review', [ReviewController::class, 'getAllReviews']);
    Route::post('/add-review', [ReviewController::class, 'store']);
    Route::get('/chart/data', [ReviewController::class, 'getDataChartReview']);
    Route::get('/item/{menuItemId}', [ReviewController::class, 'getDataReview']);
    Route::post('/{reviewId}/toggle-like', [ReviewController::class, 'toggleLike']);
    Route::delete('/{reviewId}/delete', [ReviewController::class, 'delete']);
    Route::patch('/{reviewId}/hide', [ReviewController::class, 'hide']);
    Route::patch('/{reviewId}/approve', [ReviewController::class, 'approved']);
});

Route::prefix('reply')->group(function () {
    Route::post('/add-reply', [ReviewReplyController::class, 'store']);
    Route::get('/chart', [ReviewReplyController::class, 'getAllReplies']);
    Route::delete('/{replyId}/delete', [ReviewReplyController::class, 'delete']);
    Route::patch('/{replyId}/hide', [ReviewReplyController::class, 'hide']);
    Route::patch('/{replyId}/approve', [ReviewReplyController::class, 'approved']);
});
Route::post('/send-message', [MessageController::class, 'sendMessage']);

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
Route::get('/received-orders', [PurchaseOrderController::class, 'getReceivedOrders']);
Route::get('/category-ingredient', [CategoryIngredientController::class, 'getAllCategoryIngredient']);
Route::post('/purchase-order', [PurchaseOrderController::class, 'store']);
Route::get('/purchase-orders-all', [PurchaseOrderController::class, 'index']); // danh sách + tổng quan
Route::get('/purchase-orders/{id}', [PurchaseOrderController::class, 'show']); // chi tiết
Route::patch('/purchase-orders/{id}/update-status', [PurchaseOrderController::class, 'updateStatus']);

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
| 🔐 Password Reset
|--------------------------------------------------------------------------
*/
Route::prefix('password')->group(function () {
    Route::post('/forgot', [ForgotPasswordController::class, 'sendOtp']);
    Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
    Route::post('/reset', [ForgotPasswordController::class, 'resetPassword']);
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

/*
|--------------------------------------------------------------------------
| 👤 User Management
|--------------------------------------------------------------------------
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
| 🛒 Menu & Tables
|--------------------------------------------------------------------------
*/
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/tables', [TableController::class, 'index']);
Route::apiResource('tables', TableController::class);


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
| 🧾 Orders (Eat in restaurant)
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
Route::get('/ingredients', [IngredientController::class, 'getAllIngredient']);
Route::put('/ingredients/{id}', [IngredientController::class, 'update']);
Route::post('/add', [IngredientController::class, 'store']);
Route::get('/category-ingredient', [CategoryIngredientController::class, 'getAllCategoryIngredient']);
Route::delete('ingredients/delete/{id}', [IngredientController::class, 'destroy']);
Route::get('/export', [IngredientController::class, 'exportPDF']);
Route::get('/ingredients/filter/{categoryId}', [IngredientController::class, 'filterCategory']);
Route::get('/received-orders', [PurchaseOrderController::class, 'getReceivedOrders']);
Route::get('/ingredients/used', [IngredientController::class, 'getUsedIngredients']);
Route::post('/send-message', [MessageController::class, 'sendMessage']);
Route::get('/conversations', [MessageController::class, 'getConversations']);
Route::get('/messages/{conversationId}', [MessageController::class, 'getMessages']);
Route::post('/mark-read', [MessageController::class, 'markAsRead']);
Route::post('/chat', [ChatController::class, 'message']);

//Review
Route::prefix('reviews')->group(function () {
    Route::get('/all-review', action: [ReviewController::class, 'getAllReviews']);
    Route::post('/add-review', [ReviewController::class, 'store']);
    Route::get('/chart/data', [ReviewController::class, 'getDataChartReview']);
    Route::get('/item/{menuItemId}', [ReviewController::class, 'getDataReview']);
    Route::get('/reply/{reviewId}', [ReviewReplyController::class, 'getDataReply']);
    Route::post('/{reviewId}/toggle-like', [ReviewController::class, 'toggleLike']);
    Route::delete('/{reviewId}/delete', [ReviewController::class, 'delete']);
    Route::patch('/{reviewId}/hide', [ReviewController::class, 'hide']);
    Route::patch('/{reviewId}/approve', [ReviewController::class, 'approved']);
});

Route::prefix('reply')->group(function () {
    Route::post('/add-reply/{reviewId}', [ReviewReplyController::class, 'store']);
    Route::get('/chart', [ReviewReplyController::class, 'getAllReplies']);
    Route::delete('/{replyId}/delete', [ReviewReplyController::class, 'delete']);
    Route::patch('/{replyId}/hide', [ReviewReplyController::class, 'hide']);
    Route::patch('/{replyId}/approve', [ReviewReplyController::class, 'approved']);
});
Route::post('/create-conversation', [ConversationController::class, 'createConversation']);
Route::delete('/delete-message/{messageId}', [MessageController::class, 'delete']);



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

Route::get('/categories', [CategoryController::class, 'index']);


Route::get('/pre-orders', [PreOrderController::class, 'index']);
Route::get('/pre-order-details/{id}', [PreOrderController::class, 'showDetails']);
Route::put('/pre-orders/{id}/status', [PreOrderController::class, 'updateStatus']);


Route::get('/order/create', [OrderController::class, 'create'])->name('order.create');
Route::post('/order/store', [OrderController::class, 'store'])->name('order.store');

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::post('/', [OrderController::class, 'store']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::get('/{id}/export', [OrderController::class, 'exportData']);
});

Route::get('/menu', [OrderController::class, 'menu']);

/*
|--------------------------------------------------------------------------
| 📦 Pre-Order
|--------------------------------------------------------------------------
*/
Route::prefix('pre-orders')->group(function () {
    Route::get('/', [PreOrderController::class, 'index']);
    Route::get('/details/{id}', [PreOrderController::class, 'showDetails']);
    Route::put('/{id}/status', [PreOrderController::class, 'updateStatus']);
});

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
| 🛍️ ORDER ONLINE (Frontend)
|--------------------------------------------------------------------------
*/
Route::prefix('order-online')->group(function () {
    Route::post('/', [OrderOnlineController::class, 'store']);
    Route::get('/', [OrderOnlineController::class, 'index']);
    Route::get('/{id}', [OrderOnlineController::class, 'show']);
    Route::put('/{id}', [OrderOnlineController::class, 'update']);
    
});

/*
|--------------------------------------------------------------------------
| 🛒 ORDER ONLINE ADMIN
|--------------------------------------------------------------------------
*/
Route::prefix('admin/order-online')->group(function () {
    Route::get('/', [OrderOnlineAdminController::class, 'index']);
    Route::get('/{id}', [OrderOnlineAdminController::class, 'show']);
    Route::put('/{id}', [OrderOnlineAdminController::class, 'updateStatus']);
});

/*
|--------------------------------------------------------------------------
| ⏰ Attendance
|--------------------------------------------------------------------------
*/
Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
Route::post('/attendance/today-status', [AttendanceController::class, 'getTodayStatus']);

Route::prefix('attendance')->group(function () {
    Route::get('/', [AttendanceController::class, 'index']);
    Route::get('/report', [AttendanceController::class, 'getReport']);
    Route::get('/{id}', [AttendanceController::class, 'show']);
    Route::post('/', [AttendanceController::class, 'store']);
    Route::put('/{id}', [AttendanceController::class, 'update']);
    Route::delete('/{id}', [AttendanceController::class, 'destroy']);
    
    // Export routes
    Route::get('/export/test', [AttendanceReportController::class, 'testData']);
    Route::get('/export/by-date', [AttendanceReportController::class, 'exportByDate']);
    Route::get('/export/by-month', [AttendanceReportController::class, 'exportByMonth']);
    Route::get('/export/by-range', [AttendanceReportController::class, 'exportByRange']);
});

/*
|--------------------------------------------------------------------------
| 🏢 Restaurant Info Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt.auth'])->prefix('restaurant-info')->group(function () {
    Route::get('/', [RestaurantInfoController::class, 'index']);
    Route::put('/', [RestaurantInfoController::class, 'update']);
    Route::post('/logo', [RestaurantInfoController::class, 'uploadLogo']);
    Route::delete('/logo', [RestaurantInfoController::class, 'deleteLogo']);
});
