<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
// SỬA LỖI: Dùng Model chuẩn là MenuItem
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy món ăn!'], 404);
        }

        // 1. Validation: File ảnh là tùy chọn (nullable) khi update
        $validated = $request->validate([
            'category_id' => 'sometimes|integer|exists:categories,category_id',
            'menu_item_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|string|max:50',
            'is_featured' => 'sometimes|integer|in:0,1',
            // Laravel sẽ tự xử lý _method, không cần validate
        ]);

        // 2. XỬ LÝ UPLOAD FILE MỚI
        if ($request->hasFile('image_file')) {

            // XÓA ẢNH CŨ (Tùy chọn)
            if ($dish->image_url) {
                // Tách path file ra khỏi URL công khai (ví dụ: 'http://.../storage/images/dishes/xyz.jpg' -> 'images/dishes/xyz.jpg')
                $pathSegments = parse_url($dish->image_url, PHP_URL_PATH);
                $oldPath = str_replace('/storage/', '', $pathSegments);

                // Kiểm tra và xóa file cũ
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Lưu file mới và lấy URL
            $path = $request->file('image_file')->store('images/dishes', 'public');
            $validated['image_url'] = Storage::disk('public')->url($path);
        }

        // 3. Cập nhật món ăn
        // Loại bỏ trường file khỏi $validated trước khi update
        unset($validated['image_file']);

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
}