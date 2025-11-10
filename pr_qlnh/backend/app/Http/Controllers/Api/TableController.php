<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TableController extends Controller
{
    /**
     * READ: Lấy danh sách bàn CÓ PHÂN TRANG và tổng số bàn.
     */
    public function index(Request $request)
    {
        // Lấy số lượng mỗi trang (mặc định 10)
        $perPage = $request->get('per_page', 10);

        // Lấy danh sách bàn có phân trang, sắp xếp theo ID giảm dần (mới nhất lên đầu)
        $tables = Table::orderBy('id', 'desc')->paginate($perPage);

        // Tổng số bàn trong toàn bộ hệ thống
        $totalTables = Table::count();

        // Trả về dữ liệu theo định dạng yêu cầu của frontend
        return response()->json([
            'data' => $tables->items(),
            'current_page' => $tables->currentPage(),
            'last_page' => $tables->lastPage(),
            'total_tables' => $totalTables,
        ]);
    }

    /**
     * CREATE: Thêm một bàn mới.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            // Bổ sung rule 'unique' để đảm bảo table_name không bị trùng lặp
            'table_name' => 'required|string|max:255|unique:tables,table_name',
            'table_type' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:1000',
            'status' => ['required', Rule::in(['Trống','Đang sử dụng','Đã đặt'])],
        ]);

        $table = Table::create($data);
        
        // Trả về kèm message thành công
        return response()->json([
            'message' => 'Thêm bàn mới thành công!',
            'data' => $table
        ], 201);
    }

    /**
     * SHOW: Lấy chi tiết một bàn. (Giữ nguyên)
     */
    public function show($id)
    {
        return response()->json(Table::findOrFail($id));
    }

    /**
     * UPDATE: Cập nhật thông tin bàn.
     */
    public function update(Request $request, $id)
    {
        $table = Table::findOrFail($id);

        $data = $request->validate([
            // Bổ sung rule 'unique' nhưng bỏ qua ID của bản ghi đang sửa
            'table_name' => ['required', 'string', 'max:255', Rule::unique('tables', 'table_name')->ignore($id)],
            'table_type' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:1000',
            'status' => ['required', Rule::in(['Trống','Đang sử dụng','Đã đặt'])],
        ]);

        $table->update($data);

        // Trả về kèm message thành công
        return response()->json([
            'message' => 'Cập nhật bàn thành công!',
            'data' => $table
        ]);
    }

    /**
     * DELETE: Xóa một bàn.
     */
    public function destroy($id)
    {
        $table = Table::findOrFail($id);
        
        // Logic nghiệp vụ: Ngăn chặn xóa nếu bàn đang được sử dụng
        if ($table->status === 'Đang sử dụng') {
            return response()->json(['message' => 'Không thể xóa bàn đang có khách!'], 403); // 403 Forbidden
        }

        $table->delete();

        return response()->json(['message' => 'Xóa thành công']);
    }
}