<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // Import Str để xử lý slug

class CategoryController extends Controller
{
    /**
     * Lấy danh sách danh mục (READ)
     * GET /api/categories
     */
    public function index()
    {
        // Lấy tất cả danh mục, sắp xếp theo ID giảm dần, 
        // và đếm số lượng món ăn trong mỗi danh mục (withCount)
        $categories = Category::withCount('menuItems')
            ->orderBy('category_id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $categories->count(),
            'data' => $categories
        ], 200);
    }

    /**
     * Thêm danh mục mới (CREATE)
     * POST /api/categories
     */
    public function store(Request $request)
    {
        // 1. Validation
        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'is_hidden' => 'nullable|boolean',
        ]);

        // Tự động tạo slug nếu người dùng không nhập hoặc nhập rỗng
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['category_name']);
        }

        // 2. Tạo bản ghi
        $category = Category::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm danh mục thành công!',
            'data' => $category
        ], 201);
    }

    // ------------------------------------------------------------------

    /**
     * Cập nhật danh mục (UPDATE)
     * PUT/PATCH /api/categories/{id}
     */
    public function update(Request $request, $id)
    {
        // ⭐ TC-002: 1. Kiểm tra tồn tại danh mục (Stale Data Check)
        $category = Category::find($id);

        if (!$category) {
            // Trả về 410 Gone khi danh mục đã bị xóa
            return response()->json([
                'status' => 'error',
                'message' => 'Danh mục không tồn tại hoặc đã bị xóa.'
            ], 410);
        }

        // 2. Validation
        $validated = $request->validate([
            'category_name' => 'sometimes|string|max:255|unique:categories,category_name,' . $id . ',category_id',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id . ',category_id',
            'is_hidden' => 'nullable|boolean',
            // ⭐ TC-001: Lấy timestamp gốc từ Frontend
            'original_updated_at' => 'required|date',
        ]);

        // ⭐ TC-001: 3. Kiểm tra xung đột (Optimistic Locking)
        // Lưu ý: $category->updated_at là đối tượng Carbon, cần chuyển về chuỗi để so sánh
        $currentUpdatedAt = $category->updated_at->toDateTimeString();
        $originalUpdatedAt = $validated['original_updated_at'];

        try {
            $originalUpdatedAt = \Carbon\Carbon::parse($validated['original_updated_at'])->toDateTimeString();
        } catch (\Exception $e) {
            // Phòng hờ nếu format quá lạ, gửi lỗi 400 Bad Request
            return response()->json([
                'status' => 'error',
                'message' => 'Định dạng thời gian không hợp lệ.'
            ], 400);
        }

        // So sánh hai chuỗi đã được đồng bộ hóa
        if ($currentUpdatedAt !== $originalUpdatedAt) {
            // Trả về 409 Conflict khi phát hiện xung đột
            return response()->json([
                'status' => 'error',
                'message' => 'Cập nhật thất bại. Danh mục đã được người dùng khác chỉnh sửa.',
                'latest_data' => $category // Tùy chọn: trả về dữ liệu mới nhất
            ], 409);
        }

        // Tự động tạo slug nếu category_name được cập nhật và slug không có
        if (isset($validated['category_name']) && (empty($validated['slug']) && !isset($request->slug))) {
            $validated['slug'] = Str::slug($validated['category_name']);
        }

        // Loại bỏ trường kiểm tra xung đột trước khi update
        unset($validated['original_updated_at']);

        // 4. Tiến hành cập nhật
        $category->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật danh mục thành công!',
            'data' => $category
        ]);
    }

    /**
     * Xóa danh mục (DELETE)
     * DELETE /api/categories/{id}
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy danh mục để xóa!'], 404);
        }

        // CHÚ Ý: Cần xử lý các món ăn thuộc danh mục này trước khi xóa (ví dụ: gán category_id=null hoặc xóa cascade)
        // Hiện tại, tôi chỉ thực hiện lệnh xóa đơn giản.
        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa danh mục thành công!'
        ], 200);
    }
}