<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\menuItems; // Đã đổi tên Model từ Dish/menuItems (chữ thường) sang menuItems (chữ hoa)
use Illuminate\Http\Request;

class DishController extends Controller
{
    /**
     * Lấy danh sách món ăn
     * GET /api/dishes
     */
    public function index()
    {
        // Sử dụng Model menuItems (Giả định Model đã được định nghĩa đúng)
        $dishes = menuItems::orderBy('menu_item_id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'count' => $dishes->count(),
            'data' => $dishes
        ]);
    }

    /**
     * Thêm món ăn mới
     * POST /api/dishes
     */
    public function store(Request $request)
    {
        // Sử dụng $request->validate để kiểm tra dữ liệu đầu vào
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categories,category_id', // Thêm kiểm tra khóa ngoại
            'menu_item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        $dish = menuItems::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm món ăn thành công!',
            'data' => $dish
        ], 201); // 201 Created
    }

    /**
     * Xem chi tiết 1 món ăn
     * GET /api/dishes/{id}
     */
    public function show($id)
    {
        $dish = menuItems::find($id);
        if (!$dish) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy món ăn!'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $dish]);
    }

    /**
     * Cập nhật món ăn
     * PUT/PATCH /api/dishes/{id}
     */
    public function update(Request $request, $id)
    {
        $dish = menuItems::find($id);
        if (!$dish) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy món ăn!'], 404);
        }

        // 'sometimes' đảm bảo trường chỉ được validate khi nó tồn tại trong request
        $validated = $request->validate([
            'category_id' => 'sometimes|integer|exists:categories,category_id',
            'menu_item_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image_url' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        $dish->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật món ăn thành công!',
            'data' => $dish
        ]);
    }

    /**
     * Xóa món ăn
     * DELETE /api/dishes/{id}
     */
    public function destroy($id)
    {
        $dish = menuItems::find($id);
        if (!$dish) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy món ăn!'], 404);
        }

        $dish->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa món ăn thành công!'
        ], 204); // 204 No Content
    }
}
