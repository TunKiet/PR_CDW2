<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Import Controllers
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
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationController;
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
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\ReservationManagementController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\StatisticController;


/*
|--------------------------------------------------------------------------
| Test API
|--------------------------------------------------------------------------
*/
Route::get('/test', fn () => response()->json(['message' => 'API loaded'])));


/*
|--------------------------------------------------------------------------
| Auth (JWT)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-login-otp', [AuthController::class, 'verifyLoginOTP']);

Route::prefix('password')->group(function () {
    Route::post('/forgot', [ForgotPasswordController::class, 'sendOtp']);
    Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
    Route::post('/reset', [ForgotPasswordController::class, 'resetPassword']);
});

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/login-logs', [LoginLogController::class, 'getUserLogs']);
});


/*
|--------------------------------------------------------------------------
| User Management
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
| Roles & Permissions
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt.auth'])->group(function () {
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
});


/*
|--------------------------------------------------------------------------
| Ingredients & Purchase Orders
|--------------------------------------------------------------------------
*/
Route::prefix('ingredients')->group(function () {
    Route::get('/', [IngredientController::class, 'getAllIngredient']);
    Route::post('/', [IngredientController::class, 'store']);
    Route::put('/{id}', [IngredientController::class, 'update']);
    Route::delete('/delete/{id}', [IngredientController::class, 'destroy']);
    Route::get('/filter/{categoryId}', [IngredientController::class, 'filterCategory']);
    Route::get('/used', [IngredientController::class, 'getUsedIngredients']);
    Route::get('/alert', [IngredientController::class, 'alertIngredient']);
    Route::get('/export/{id}', [IngredientController::class, 'exportPDF']);
});

Route::get('/category-ingredient', [CategoryIngredientController::class, 'getAllCategoryIngredient']);

Route::prefix('purchase-orders')->group(function () {
    Route::get('/', [PurchaseOrderController::class, 'index']);
    Route::post('/', [PurchaseOrderController::class, 'store']);
    Route::get('/received', [PurchaseOrderController::class, 'getReceivedOrders']);
    Route::get('/{id}', [PurchaseOrderController::class, 'show']);
    Route::patch('/{id}/update-status', [PurchaseOrderController::class, 'updateStatus']);
});


/*
|--------------------------------------------------------------------------
| Categories, Dishes, Menu
|--------------------------------------------------------------------------
*/
Route::apiResource('categories', CategoryController::class);
Route::apiResource('dishes', DishController::class);

Route::prefix('dishes')->group(function () {
    Route::patch('/{id}/status', [DishController::class, 'updateStatus']);
    Route::post('/bulk-update-status', [DishController::class, 'bulkUpdateStatus']);
    Route::get('/{id}/status-history', [DishController::class, 'getStatusHistory']);
    Route::get('/status-stats', [DishController::class, 'getStatusStats']);
    Route::get('/low-stock', [DishController::class, 'getLowStock']);
    Route::get('/filter', [DishController::class, 'filter']);
});

Route::get('/menu', [OrderController::class, 'menu']);
Route::apiResource('menu-items', MenuItemController::class);


/*
|--------------------------------------------------------------------------
| Tables
|--------------------------------------------------------------------------
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
Route::put('/tables/{id}/status', [TableController::class, 'updateStatus']);
Route::get('/floorplan', [TableController::class, 'floorplan']);


/*
|--------------------------------------------------------------------------
| Customers
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
| Orders (Eat-in)
|--------------------------------------------------------------------------
*/
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::post('/', [OrderController::class, 'store']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
    Route::get('/{id}/export', [OrderController::class, 'exportData']);
});


/*
|--------------------------------------------------------------------------
| Pre-orders
|--------------------------------------------------------------------------
*/
Route::prefix('pre-orders')->group(function () {
    Route::get('/', [PreOrderController::class, 'index']);
    Route::get('/details/{id}', [PreOrderController::class, 'showDetails']);
    Route::put('/{id}/status', [PreOrderController::class, 'updateStatus']);
});


/*
|--------------------------------------------------------------------------
| Reviews & Replies
|--------------------------------------------------------------------------
*/
Route::prefix('reviews')->group(function () {
    Route::post('/', [ReviewController::class, 'store']);
    Route::get('/all-review', [ReviewController::class, 'getAllReviews']);
    Route::get('/chart/data', [ReviewController::class, 'getDataChartReview']);
    Route::get('/item/{menuItemId}', [ReviewController::class, 'getDataReview']);
    Route::get('/{menuItemId}/average', [ReviewController::class, 'averageRating']);
    Route::post('/{reviewId}/toggle-like', [ReviewController::class, 'toggleLike']);
    Route::delete('/{reviewId}/delete', [ReviewController::class, 'delete']);
    Route::patch('/{reviewId}/hide', [ReviewController::class, 'hide']);
    Route::patch('/{reviewId}/approve', [ReviewController::class, 'approved']);
});

Route::prefix('reply')->group(function () {
    Route::post('/add/{reviewId}', [ReviewReplyController::class, 'store']);
    Route::get('/chart', [ReviewReplyController::class, 'getAllReplies']);
    Route::delete('/{replyId}/delete', [ReviewReplyController::class, 'delete']);
    Route::patch('/{replyId}/hide', [ReviewReplyController::class, 'hide']);
    Route::patch('/{replyId}/approve', [ReviewReplyController::class, 'approved']);
});


/*
|--------------------------------------------------------------------------
| Messages & Chat
|--------------------------------------------------------------------------
*/
Route::post('/send-message', [MessageController::class, 'sendMessage']);
Route::post('/chat', [ChatController::class, 'message']);
Route::get('/conversations', [MessageController::class, 'getConversations']);
Route::get('/messages/{conversationId}', [MessageController::class, 'getMessages']);
Route::post('/mark-read', [MessageController::class, 'markAsRead']);
Route::delete('/delete-message/{id}', [MessageController::class, 'delete']);
Route::post('/create-conversation', [ConversationController::class, 'createConversation']);


/*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/
Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::post('/', [PaymentController::class, 'store']);
});


/*
|--------------------------------------------------------------------------
| Order Online (Frontend & Admin)
|--------------------------------------------------------------------------
*/
Route::prefix('order-online')->group(function () {
    Route::get('/', [OrderOnlineController::class, 'index']);
    Route::get('/{id}', [OrderOnlineController::class, 'show']);
    Route::post('/', [OrderOnlineController::class, 'store']);
    Route::put('/{id}', [OrderOnlineController::class, 'update']);
});

Route::prefix('admin/order-online')->group(function () {
    Route::get('/', [OrderOnlineAdminController::class, 'index']);
    Route::get('/{id}', [OrderOnlineAdminController::class, 'show']);
    Route::put('/{id}', [OrderOnlineAdminController::class, 'updateStatus']);
});


/*
|--------------------------------------------------------------------------
| Attendance
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

    Route::prefix('export')->group(function () {
        Route::get('/test', [AttendanceReportController::class, 'testData']);
        Route::get('/by-date', [AttendanceReportController::class, 'exportByDate']);
        Route::get('/by-month', [AttendanceReportController::class, 'exportByMonth']);
        Route::get('/by-range', [AttendanceReportController::class, 'exportByRange']);
    });
});


/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/
Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::post('/', [NotificationController::class, 'store']);
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/{id}', [NotificationController::class, 'show']);
    Route::put('/{id}', [NotificationController::class, 'update']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
    Route::post('/{id}/mark-read', [NotificationController::class, 'markRead']);
    Route::post('/mark-all-read', [NotificationController::class, 'markAllRead']);
});


/*
|--------------------------------------------------------------------------
| Restaurant Info
|--------------------------------------------------------------------------
*/
Route::middleware(['jwt.auth'])->prefix('restaurant-info')->group(function () {
    Route::get('/', [RestaurantInfoController::class, 'index']);
    Route::put('/', [RestaurantInfoController::class, 'update']);
    Route::post('/logo', [RestaurantInfoController::class, 'uploadLogo']);
    Route::delete('/logo', [RestaurantInfoController::class, 'deleteLogo']);
});


/*
|--------------------------------------------------------------------------
| Promotions (v1)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    Route::apiResource('promotions', PromotionController::class);
    Route::post('/promotions/{id}/apply', [PromotionController::class, 'apply']);
    Route::get('/featured-dishes', [DishController::class, 'getFeatured']);
    Route::get('/active-promotions', [PromotionController::class, 'getActive']);
});


/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
Route::prefix('statistics')->group(function () {
    Route::get('/dashboard', [StatisticController::class, 'dashboard']);
    Route::get('/revenue-chart', [StatisticController::class, 'revenueChart']);
    Route::get('/top-dishes', [StatisticController::class, 'topDishes']);
    Route::get('/comparison', [StatisticController::class, 'comparison']);
    Route::get('/top-customers', [StatisticController::class, 'topCustomers']);
    Route::get('/summary', [StatisticController::class, 'summary']);
});

