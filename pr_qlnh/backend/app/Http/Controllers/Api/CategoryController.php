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
        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name',
            // Slug là tùy chọn, nếu không có, sẽ tự động tạo
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'is_hidden' => 'nullable|boolean',
        ]);

        // Tự động tạo slug nếu người dùng không nhập hoặc nhập rỗng
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['category_name']);
        }

        $category = Category::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm danh mục thành công!',
            'data' => $category
        ], 201); // 201 Created
    }

    /**
     * Cập nhật danh mục (UPDATE)
     * PUT/PATCH /api/categories/{id}
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy danh mục!'], 404);
        }

        $validated = $request->validate([
            'category_name' => 'sometimes|string|max:255|unique:categories,category_name,' . $id . ',category_id',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id . ',category_id',
            'is_hidden' => 'nullable|boolean',
        ]);
        
        // Tự động tạo slug nếu category_name được cập nhật và slug không có
        if (isset($validated['category_name']) && (empty($validated['slug']) && !isset($request->slug))) {
            $validated['slug'] = Str::slug($validated['category_name']);
        }
        
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