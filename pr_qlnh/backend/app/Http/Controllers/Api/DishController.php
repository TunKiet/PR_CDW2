<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
// SỬA LỖI: Dùng Model chuẩn là MenuItem
use App\Models\MenuItem;
use App\Models\DishStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class DishController extends Controller
{
    /**
     * Lấy danh sách món ăn
     * GET /api/dishes
     */
    public function index()
    {
        // Dùng Model đã sửa tên
        $dishes = MenuItem::orderBy('menu_item_id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'count' => $dishes->count(),
            'data' => $dishes // Trả về mảng các object Model thô
        ]);
    }


    public function store(Request $request)
    {
        // 1. Validation: Yêu cầu file ảnh khi thêm mới
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categories,category_id',
            'menu_item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            // QUAN TRỌNG: 'image_file' phải khớp với tên field trong FormData ở Frontend
            'image_file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|string|max:50',
        ]);

        // 2. XỬ LÝ UPLOAD FILE
        if ($request->hasFile('image_file')) {
            // Lưu file vào thư mục public/images/dishes
            // 'public' là tên của đĩa (disk) đã được cấu hình trong config/filesystems.php
            $path = $request->file('image_file')->store('images/dishes', 'public');

            // Gán URL công khai vào trường image_url
            $validated['image_url'] = Storage::disk('public')->url($path);
        }

        // 3. Tạo món ăn
        // Loại bỏ trường file khỏi $validated trước khi tạo, nếu không sẽ bị lỗi
        unset($validated['image_file']);

        $dish = MenuItem::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm món ăn thành công!',
            'data' => $dish
        ], 201);
    }

    /**
     * Cập nhật món ăn (Update)
     */
    public function update(Request $request, $id)
    {
        $dish = MenuItem::find($id);
        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy món ăn!'
            ], 404);
        }

        // ⭐ KIỂM TRA TIMESTAMP (SỬ DỤNG updated_at CÓ SẴN)
        $clientUpdatedAt = $request->input('updated_at');

        if ($clientUpdatedAt) {
            // So sánh timestamp client gửi lên với DB
            $dbTimestamp = $dish->updated_at->format('Y-m-d H:i:s');
            $clientTimestamp = date('Y-m-d H:i:s', strtotime($clientUpdatedAt));

            if ($clientTimestamp !== $dbTimestamp) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Dữ liệu đã bị thay đổi bởi người dùng khác. Vui lòng tải lại trang!',
                    'error_code' => 'DATA_CONFLICT',
                    'current_data' => $dish, // Trả về data mới nhất
                    'client_timestamp' => $clientTimestamp,
                    'server_timestamp' => $dbTimestamp,
                ], 409); // HTTP 409 Conflict
            }
        }

        // PHẦN VALIDATION VÀ UPDATE GIỮ NGUYÊN
        $validated = $request->validate([
            'category_id' => 'sometimes|integer|exists:categories,category_id',
            'menu_item_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|string|max:50',
            'is_featured' => 'sometimes|integer|in:0,1',
        ]);

        // Xử lý upload file
        if ($request->hasFile('image_file')) {
            if ($dish->image_url) {
                $pathSegments = parse_url($dish->image_url, PHP_URL_PATH);
                $oldPath = str_replace('/storage/', '', $pathSegments);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('image_file')->store('images/dishes', 'public');
            $validated['image_url'] = Storage::disk('public')->url($path);
        }

        unset($validated['image_file']);
        unset($validated['updated_at']); // ⭐ Loại bỏ updated_at khỏi validated data

        $dish->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật món ăn thành công!',
            'data' => $dish->fresh() // Trả về data mới kèm updated_at mới
        ]);
    }

    /**
     * Xóa món ăn theo ID
     * DELETE /api/dishes/{id}
     */
    public function destroy($id)
    {
        // 1. Tìm món ăn theo ID
        $dish = MenuItem::find($id);

        // 2. Kiểm tra nếu không tìm thấy
        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy món ăn để xóa!'
            ], 404); // Trả về lỗi 404 Not Found
        }

        // 3. Tiến hành xóa
        $dish->delete();

        // 4. Trả về phản hồi thành công (200 OK hoặc 204 No Content)
        return response()->json([
            'status' => 'success',
            'message' => 'Xóa món ăn thành công!'
        ], 200);
        // Lưu ý: Có thể dùng status 204 (No Content) nếu không cần trả về body
    }

    public function getFeatured()
    {
        $featuredDishes = MenuItem::with('category')
            ->where('is_featured', 1)
            ->where('status', 'active')
            ->limit(3)
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $featuredDishes->count(),
            'data' => $featuredDishes
        ]);
    }

    /**
     * ⭐ CẬP NHẬT TRẠNG THÁI ĐƠN LẺ (Toggle Status)
     * PATCH /api/dishes/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $dish = MenuItem::find($id);

        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy món ăn!'
            ], 404);
        }

        // ⭐ KIỂM TRA CONFLICT
        $clientUpdatedAt = $request->input('updated_at');

        if ($clientUpdatedAt) {
            $dbTimestamp = $dish->updated_at->format('Y-m-d H:i:s');
            $clientTimestamp = date('Y-m-d H:i:s', strtotime($clientUpdatedAt));

            if ($clientTimestamp !== $dbTimestamp) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Dữ liệu đã được thay đổi. Vui lòng tải lại!',
                    'error_code' => 'DATA_CONFLICT',
                    'current_data' => $dish,
                ], 409);
            }
        }

        // Validation
        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive,out_of_stock,paused',
            'unavailable_reason' => 'nullable|string|max:255',
            'unavailable_until' => 'nullable|date',
            'stock_quantity' => 'nullable|integer|min:0',
        ]);

        $oldStatus = $dish->status;

        $dish->update($validated);

        // Ghi log
        DishStatusHistory::create([
            'menu_item_id' => $dish->menu_item_id,
            'old_status' => $oldStatus,
            'new_status' => $validated['status'],
            'reason' => $validated['unavailable_reason'] ?? null,
            'changed_by' => $request->user()->id ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái thành công!',
            'data' => $dish->fresh()
        ]);
    }

    /**
     * ⭐ CẬP NHẬT HÀNG LOẠT (Bulk Update Status)
     * POST /api/dishes/bulk-update-status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'dish_ids' => 'required|array',
            'dish_ids.*' => 'integer|exists:menu_items,menu_item_id',
            'status' => 'required|string|in:active,inactive,out_of_stock,paused',
            'unavailable_reason' => 'nullable|string|max:255',
        ]);

        $updatedCount = 0;

        DB::transaction(function () use ($validated, &$updatedCount, $request) {
            foreach ($validated['dish_ids'] as $dishId) {
                $dish = MenuItem::find($dishId);

                if ($dish) {
                    $oldStatus = $dish->status;

                    $dish->update([
                        'status' => $validated['status'],
                        'unavailable_reason' => $validated['unavailable_reason'] ?? null,
                        'updated_by' => $request->user()->id ?? null,
                    ]);

                    // Ghi log
                    DishStatusHistory::create([
                        'menu_item_id' => $dish->menu_item_id,
                        'old_status' => $oldStatus,
                        'new_status' => $validated['status'],
                        'reason' => $validated['unavailable_reason'] ?? 'Cập nhật hàng loạt',
                        'changed_by' => $request->user()->id ?? null,
                    ]);

                    $updatedCount++;
                }
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => "Đã cập nhật {$updatedCount} món ăn!",
            'updated_count' => $updatedCount
        ]);
    }

    /**
     * ⭐ LẤY LỊCH SỬ THAY ĐỔI TRẠNG THÁI
     * GET /api/dishes/{id}/status-history
     */
    public function getStatusHistory($id)
    {
        $dish = MenuItem::find($id);

        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy món ăn!'
            ], 404);
        }

        $history = DishStatusHistory::with('user:id,name')
            ->where('menu_item_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'dish' => $dish,
                'history' => $history
            ]
        ]);
    }

    /**
     * ⭐ LẤY THỐNG KÊ TRẠNG THÁI
     * GET /api/dishes/status-stats
     */
    public function getStatusStats()
    {
        $stats = MenuItem::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $total = MenuItem::count();
        $lowStock = MenuItem::where('stock_quantity', '<=', 5)
            ->where('stock_quantity', '>', 0)
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total' => $total,
                'by_status' => $stats,
                'low_stock_count' => $lowStock,
                'active_percentage' => $total > 0 ? round(($stats['active'] ?? 0) / $total * 100, 1) : 0,
            ]
        ]);
    }

    /**
     * ⭐ LẤY DANH SÁCH MÓN SẮP HẾT
     * GET /api/dishes/low-stock
     */
    public function getLowStock()
    {
        $dishes = MenuItem::with('category')
            ->where('stock_quantity', '<=', 5)
            ->where('stock_quantity', '>', 0)
            ->orderBy('stock_quantity', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $dishes->count(),
            'data' => $dishes
        ]);
    }

    /**
     * ⭐ LỌC MÓN ĂN NÂNG CAO
     * GET /api/dishes/filter
     */
    public function filter(Request $request)
    {
        $query = MenuItem::with('category');

        // Lọc theo status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Lọc theo category
        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('category_id', $request->category_id);
        }

        // Lọc theo tồn kho
        if ($request->has('stock_level')) {
            switch ($request->stock_level) {
                case 'in-stock':
                    $query->where('stock_quantity', '>', 5);
                    break;
                case 'low-stock':
                    $query->whereBetween('stock_quantity', [1, 5]);
                    break;
                case 'out-of-stock':
                    $query->where('stock_quantity', 0);
                    break;
            }
        }

        // Lọc theo từ khóa
        if ($request->has('keyword') && $request->keyword != '') {
            $query->where('menu_item_name', 'like', '%' . $request->keyword . '%');
        }

        // Sắp xếp
        $sortBy = $request->get('sort_by', 'menu_item_id');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $dishes = $query->get();

        return response()->json([
            'status' => 'success',
            'count' => $dishes->count(),
            'data' => $dishes
        ]);
    }
}