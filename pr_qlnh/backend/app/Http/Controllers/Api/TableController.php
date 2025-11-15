<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TableController extends Controller
{
    /**
     * LIST: Lấy danh sách bàn + phân trang
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        // CHÚ Ý: Order theo table_id, KHÔNG phải id
        $tables = Table::orderBy('table_id', 'desc')->paginate($perPage);

        return response()->json([
            'data'        => $tables->items(),
            'current_page'=> $tables->currentPage(),
            'last_page'   => $tables->lastPage(),
            'total_tables'=> $tables->total(),
        ]);
    }

    /**
     * CREATE: Thêm bàn mới
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'table_name' => 'required|string|max:255|unique:tables,table_name',
            'table_type' => 'nullable|string|max:255',
            'capacity'   => 'required|integer|min:1',
            'note'       => 'nullable|string|max:255',
            'status'     => ['required', Rule::in(['Trống','Đang sử dụng','Đã đặt'])],
        ]);

        $table = Table::create($data);

        return response()->json([
            'message' => 'Thêm bàn thành công!',
            'data'    => $table
        ], 201);
    }

    /**
     * SHOW: Xem chi tiết 1 bàn
     */
    public function show($id)
    {
        return response()->json(Table::findOrFail($id));
    }

    /**
     * UPDATE: Cập nhật bàn
     */
    public function update(Request $request, $id)
    {
        $table = Table::findOrFail($id);

        $data = $request->validate([
            'table_name' => [
                'required',
                'string',
                'max:255',
                // BỎ QUA bản ghi có table_id = $id
                Rule::unique('tables', 'table_name')->ignore($id, 'table_id')
            ],
            'table_type' => 'nullable|string|max:255',
            'capacity'   => 'required|integer|min:1',
            'note'       => 'nullable|string|max:255',
            'status'     => ['required', Rule::in(['Trống','Đang sử dụng','Đã đặt'])],
        ]);

        $table->update($data);

        return response()->json([
            'message' => 'Cập nhật thành công!',
            'data'    => $table
        ]);
    }

    /**
     * DELETE: Xóa bàn
     */
    public function destroy($id)
    {
        $table = Table::findOrFail($id);

        if ($table->status === 'Đang sử dụng') {
            return response()->json([
                'message' => 'Không thể xóa bàn đang có khách!'
            ], 403);
        }

        $table->delete();

        return response()->json([
            'message' => 'Xóa bàn thành công!'
        ]);
    }
}
