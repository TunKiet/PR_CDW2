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
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $tables = Table::orderBy('table_id', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bàn thành công',
                'data' => $tables->items(),
                'current_page' => $tables->currentPage(),
                'last_page' => $tables->lastPage(),
                'total_tables' => $tables->total(),
            ]);
        } catch (\Exception $e) {
            Log::error("Error index tables: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server khi tải danh sách'],500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'table_name' => 'required|string|max:255|unique:tables,table_name',
                'table_type' => 'nullable|string|max:255',
                'capacity'   => 'required|integer|min:1',
                'note'       => 'nullable|string|max:255',
                'status'     => ['required', Rule::in(['Trống','Đang sử dụng','Đã đặt'])],
            ]);

            $table = Table::create($data);

            return response()->json(['success'=>true,'message'=>'Thêm bàn thành công','data'=>$table],201);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['success'=>false,'error'=>'Dữ liệu không hợp lệ','details'=>$ve->errors()],422);
        } catch (\Exception $e) {
            Log::error("Error store table: ".$e->getMessage());
            return response()->json(['success'=>false,'error'=>'Lỗi server khi thêm bàn'],500);
        }
    }

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
                'table_type' => 'nullable|string|max:255',
                'capacity'   => 'required|integer|min:1',
                'note'       => 'nullable|string|max:255',
                'status'     => ['required', Rule::in(['Trống','Đang sử dụng','Đã đặt'])],
            ]);

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
    public function floorplan()
    {
        $tables = Table::orderBy('capacity')->orderBy('table_name')->get();

        // Gom theo số chỗ
        $grouped = $tables->groupBy('capacity');

        return response()->json([
            "data" => $grouped
        ]);
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $table = Table::findOrFail($id);
        $table->status = $request->status;
        $table->save();

        return response()->json([
            "message" => "Cập nhật trạng thái thành công",
            "data" => $table
        ]);
    }
}
