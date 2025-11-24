<?php
// D:\CDW2\PR_CDW2\pr_qlnh\backend\app\Http\Controllers\Api\DishController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
// SỬA LỖI: Dùng Model chuẩn là MenuItem
use App\Models\MenuItem;
use Illuminate\Http\Request;

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

    // ... (Các hàm store, show, update, destroy giữ nguyên nhưng sửa Model) ...

    public function store(Request $request)
    {
        // === VỊ TRÍ 1: BIẾN $validated ĐƯỢC GÁN TẠI ĐÂY ===
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categories,category_id',
            'menu_item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        // Nếu validation thành công, code tiếp tục chạy và sử dụng $validated
        $dish = MenuItem::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm món ăn thành công!',
            'data' => $dish
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $dish = MenuItem::find($id);
        if (!$dish) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy món ăn!'], 404);
        }

        // === VỊ TRÍ 2: BIẾN $validated ĐƯỢC GÁN TẠI ĐÂY ===
        $validated = $request->validate([
            'category_id' => 'sometimes|integer|exists:categories,category_id',
            'menu_item_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image_url' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        // Nếu validation thành công, code tiếp tục chạy và sử dụng $validated
        $dish->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật món ăn thành công!',
            'data' => $dish
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
}