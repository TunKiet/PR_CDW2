<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        // ⭐ VALIDATE TIẾNG VIỆT
        $validated = $request->validate([

            'table_id'          => 'required|exists:tables,table_id',
            'reservation_date'  => 'required|date',
            'reservation_time'  => 'required|date_format:H:i', // Thêm validation format H:i
            'num_guests'        => 'required|integer|min:1',
            'deposit_amount'    => 'nullable|numeric|min:0',
            'note'              => 'nullable|string',

        ], [

            'required'      => ':attribute không được bỏ trống.',
            'date'          => ':attribute không hợp lệ.',
            'date_format'   => ':attribute không đúng định dạng (HH:MM).',
            'integer'       => ':attribute phải là số.',
            'numeric'       => ':attribute phải là số.',
            'min'           => ':attribute phải lớn hơn hoặc bằng :min.',
            'exists'        => ':attribute không tồn tại.',

        ], [

            'table_id'          => 'Bàn',
            'reservation_date'  => 'Ngày đặt bàn',
            'reservation_time'  => 'Giờ đặt bàn',
            'num_guests'        => 'Số khách',
            'deposit_amount'    => 'Tiền cọc',
            'note'              => 'Ghi chú',

        ]);

        // Lấy thông tin bàn
        $table = Table::find($validated['table_id']);
        if (!$table) {
            return response()->json(["message" => "Bàn không tồn tại."], 422);
        }

        // (3) Check số khách không vượt quá sức chứa
        if ($validated['num_guests'] > $table->capacity) {
            return response()->json([
                "message" => "Số lượng khách vượt quá sức chứa của bàn này ({$table->capacity} người)."
            ], 422);
        }

        // --- Bắt đầu Logic Xử lý Thời gian Mới ---
        
        // Ghép ngày + giờ thành đối tượng Carbon
        $selectedDateTime = Carbon::parse($validated['reservation_date'] . ' ' . $validated['reservation_time']);
        $now = Carbon::now();
        $today = Carbon::today();
        
        // (1) Ngày đặt không được là ngày trong quá khứ
        // So sánh ngày đặt với ngày hiện tại (bỏ qua giờ)
        if ($selectedDateTime->startOfDay()->isBefore($now->startOfDay())) {
            return response()->json([
                "message" => "Ngày đặt bàn không được là ngày trong quá khứ."
            ], 422);
        }

        // (2) Kiểm tra giờ đặt trong khung hoạt động chung (09:00 - 22:00)
        $openTime = Carbon::parse("09:00");
        $closeTime = Carbon::parse("22:00");
        $selectedTimeOnly = Carbon::parse($validated['reservation_time']); // Chỉ lấy giờ

        // Kiểm tra giờ (HH:MM) phải nằm giữa 09:00 và 22:00 (hoặc bằng 09:00, không được bằng 22:00)
        // Dùng lt() và gt() hoặc lte() và gte() tùy vào quy tắc chính xác của nhà hàng.
        // Giả sử 09:00 là mở cửa, 22:00 là giờ nhận khách cuối cùng.
        // Ở đây, tôi dùng lt/gt để loại bỏ các giờ < 09:00 và > 22:00
        if ($selectedTimeOnly->lt($openTime) || $selectedTimeOnly->gt($closeTime)) {
            return response()->json([
                "message" => "Giờ đặt bàn phải nằm trong khung hoạt động từ 09:00 đến 22:00."
            ], 422);
        }
        
        // (3) Nếu đặt bàn cho HÔM NAY, phải cách hiện tại tối thiểu 2 giờ
        if ($selectedDateTime->isSameDay($now)) {
            $nowPlus2Hours = $now->copy()->addHours(2);
            
            if ($selectedDateTime->lessThan($nowPlus2Hours)) {
                $earliestTime = $nowPlus2Hours->format('H:i');
                
                return response()->json([
                    "message" => "Thời gian đặt bàn hôm nay phải cách thời điểm hiện tại ít nhất 2 giờ. Vui lòng chọn sau {$earliestTime}."
                ], 422);
            }
        }
        
        // --- Kết thúc Logic Xử lý Thời gian Mới ---

        // (5) Check bàn trùng giờ đặt
        $exists = Reservation::where('table_id', $validated['table_id'])
            ->where('reservation_date', $validated['reservation_date'])
            ->where('reservation_time', $validated['reservation_time'])
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($exists) {
            return response()->json([
                "message" => "Bàn này đã có người đặt vào thời điểm bạn chọn."
            ], 422);
        }

        // Tạo đặt bàn
        $validated['user_id'] = auth()->id() ?? 1;
        $validated['status'] = "pending";

        $reservation = Reservation::create($validated);

        return response()->json([
            "message" => "Đặt bàn thành công!",
            "data" => $reservation
        ]);
    }
}