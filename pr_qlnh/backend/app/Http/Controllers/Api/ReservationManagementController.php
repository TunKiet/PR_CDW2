<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationManagementController extends Controller
{
    /**
     * Lấy danh sách đơn (có lọc)
     * Dùng cho tab "Quản lý đặt bàn" + "Lịch sử đặt bàn"
     */
    public function index(Request $request)
    {
        $query = Reservation::query()
            ->with(['user', 'table'])
            ->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc');

        // Lọc theo trạng thái
        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Lọc theo ngày
        if ($request->date) {
            $query->where('reservation_date', $request->date);
        }

        // Tìm kiếm theo id / username / phone / email / table_id / note
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('reservation_id', 'LIKE', "%$search%")
                ->orWhere('note', 'LIKE', "%$search%")
                ->orWhereHas('user', function ($uq) use ($search) {
                    $uq->where('username', 'LIKE', "%$search%")
                    ->orWhere('phone', 'LIKE', "%$search%")
                    ->orWhere('email', 'LIKE', "%$search%");
                })
                ->orWhereHas('table', function ($tq) use ($search) {
                    $tq->where('table_id', 'LIKE', "%$search%");
                });
            });
        }


        return response()->json([
            "data" => $query->paginate($request->per_page ?? 15)
        ]);
    }


    /**
     * Lấy chi tiết đơn đặt bàn
     */
    public function show($id)
    {
        $item = Reservation::with(['user', 'table'])->findOrFail($id);

        return response()->json([
            "data" => $item
        ]);
    }


    /**
     * Cập nhật trạng thái đơn
     * (Pending → Confirmed → Completed hoặc Cancelled)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Completed,Cancelled'
        ]);

        $item = Reservation::findOrFail($id);
        $item->status = $request->status;
        $item->save();

        return response()->json([
            "message" => "Cập nhật trạng thái thành công.",
            "data" => $item
        ]);
    }


    /**
     * Hủy đơn đặt bàn
     */
    public function cancel($id)
    {
        $item = Reservation::findOrFail($id);
        $item->status = "Cancelled";
        $item->save();

        return response()->json([
            "message" => "Đã hủy đơn đặt bàn.",
        ]);
    }


    /**
     * Xóa đơn đặt bàn
     */
    public function destroy($id)
    {
        Reservation::findOrFail($id)->delete();

        return response()->json([
            "message" => "Đã xóa đơn đặt bàn."
        ]);
    }
}
