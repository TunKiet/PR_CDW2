<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class TableController extends Controller
{
    // Danh sách khu vực chuẩn
    private $allowedTypes = [
        'Sảnh máy lạnh',
        'Ngoài trời',
        'Phòng VIP'
    ];

    // Danh sách trạng thái chuẩn
    private $allowedStatus = [
        'Trống',
        'Đang sử dụng',
        'Đã đặt'
    ];

    /**
     * Lấy toàn bộ danh sách bàn (không phân trang)
     */
    public function index(Request $request)
    {
        try {
            $tables = Table::orderBy('table_id', 'asc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bàn thành công',
                'data' => $tables,
                'total_tables' => $tables->count(),
            ]);
        } catch (\Exception $e) {
            Log::error("Error index tables: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server khi tải danh sách'],500);
        }
    }

    /**
     * Thêm bàn mới
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'table_name' => 'required|string|max:255|unique:tables,table_name',
                'table_type' => ['required', Rule::in($this->allowedTypes)],
                'capacity'   => 'required|integer|min:1',
                'note'       => 'nullable|string|max:255',
                'status'     => ['required', Rule::in($this->allowedStatus)],
            ]);

            // Trim dữ liệu tránh khoảng trắng
            $data = array_map(fn($v) => is_string($v) ? trim($v) : $v, $data);

            $table = Table::create($data);

            return response()->json(['success'=>true,'message'=>'Thêm bàn thành công','data'=>$table],201);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['success'=>false,'error'=>'Dữ liệu không hợp lệ','details'=>$ve->errors()],422);
        } catch (\Exception $e) {
            Log::error("Error store table: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server khi thêm bàn'],500);
        }
    }

    /**
     * Lấy chi tiết 1 bàn
     */
    public function show($id)
    {
        try {
            $table = Table::findOrFail($id);
            return response()->json(['success'=>true,'data'=>$table]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success'=>false,'error'=>'Không tìm thấy bàn'],404);
        } catch (\Exception $e) {
            Log::error("Error show table: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server'],500);
        }
    }

    /**
     * Cập nhật bàn
     */
    public function update(Request $request, $id)
    {
        try {
            $table = Table::findOrFail($id);

            $data = $request->validate([
                'table_name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('tables','table_name')->ignore($id,'table_id'),
                ],
                'table_type' => ['required', Rule::in($this->allowedTypes)],
                'capacity'   => 'required|integer|min:1',
                'note'       => 'nullable|string|max:255',
                'status'     => ['required', Rule::in($this->allowedStatus)],
            ]);

            // Trim dữ liệu
            $data = array_map(fn($v) => is_string($v) ? trim($v) : $v, $data);

            $table->update($data);

            return response()->json(['success'=>true,'message'=>'Cập nhật thành công','data'=>$table]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success'=>false,'error'=>'Không tìm thấy bàn'],404);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['success'=>false,'error'=>'Dữ liệu không hợp lệ','details'=>$ve->errors()],422);
        } catch (\Exception $e) {
            Log::error("Error update table: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server khi cập nhật'],500);
        }
    }

    /**
     * Xóa bàn
     */
    public function destroy($id)
    {
        try {
            $table = Table::findOrFail($id);

            if ($table->status === 'Đang sử dụng') {
                return response()->json(['success'=>false,'error'=>'Không thể xóa bàn đang có khách'],403);
            }

            $table->delete();
            return response()->json(['success'=>true,'message'=>'Xóa bàn thành công']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success'=>false,'error'=>'Không tìm thấy bàn'],404);
        } catch (\Exception $e) {
            Log::error("Error destroy table: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server khi xóa'],500);
        }
    }
}