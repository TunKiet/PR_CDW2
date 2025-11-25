<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * API tạo đặt bàn
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,table_id',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required',
            'num_guests' => 'required|integer|min:1',
            'deposit_amount' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        // Auto add user id (nếu có login)
        $validated['user_id'] = auth()->id() ?? null;

        // User không được tự thay đổi status → luôn pending
        $validated['status'] = 'pending';

        // CHECK: Bàn đã được đặt chưa (cùng ngày + giờ)
        $exists = Reservation::where('table_id', $validated['table_id'])
            ->where('reservation_date', $validated['reservation_date'])
            ->where('reservation_time', $validated['reservation_time'])
            ->where('status', '!=', 'cancelled') // hủy thì coi như trống
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Bàn này đã có người đặt vào thời điểm này!'
            ], 422);
        }

        // Tạo đặt bàn
        $reservation = Reservation::create($validated);

        return response()->json([
            'message' => 'Đặt bàn thành công!',
            'data' => $reservation
        ]);
    }
}
