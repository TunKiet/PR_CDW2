<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * API: Báo cáo khách hàng thường xuyên
     * 
     * Thống kê theo khoảng thời gian:
     *  - week   = 7 ngày
     *  - month  = 30 ngày
     *  - quarter = 90 ngày
     */
    public function frequentCustomers(Request $request)
    {
        // Nhận tham số từ FE
        $range = $request->query('range', 'month');

        // Xác định mốc thời gian
        switch ($range) {
            case 'week':
                $from = now()->subWeek(); // 7 ngày trước
                break;

            case 'quarter':
                $from = now()->subMonths(3); // 3 tháng trước
                break;

            default:
                $from = now()->subMonth(); // mặc định: 1 tháng
        }

        /* ----------------------------------------------------------
            LẤY SỐ LẦN ĐẶT MÓN (orders)
        ----------------------------------------------------------- */
        $orders = DB::table('orders')
            ->select(
                'user_id',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total_price) as total_spent')
            )
            ->where('created_at', '>=', $from)
            ->groupBy('user_id');

        /* ----------------------------------------------------------
            LẤY SỐ LẦN ĐẶT BÀN (reservations)
        ----------------------------------------------------------- */
        $reservations = DB::table('reservations')
            ->select(
                'user_id',
                DB::raw('COUNT(*) as reservation_count')
            )
            ->where('created_at', '>=', $from)
            ->groupBy('user_id');

        /* ----------------------------------------------------------
            GỘP DỮ LIỆU VỚI BẢNG USERS
        ----------------------------------------------------------- */
        $data = DB::table('users')
            ->leftJoinSub($orders, 'o', 'users.user_id', '=', 'o.user_id')
            ->leftJoinSub($reservations, 'r', 'users.user_id', '=', 'r.user_id')
            ->select(
                'users.user_id',
                'users.username',
                DB::raw('COALESCE(o.order_count, 0) as order_count'),
                DB::raw('COALESCE(r.reservation_count, 0) as reservation_count'),
                DB::raw('COALESCE(o.total_spent, 0) as total_spent'),
                DB::raw('(COALESCE(o.order_count, 0) + COALESCE(r.reservation_count, 0)) as activity_score')
            )
            ->where('users.role', 'user')
            ->orderByDesc('activity_score')
            ->paginate(10);


        return response()->json([
            'success' => true,
            'range' => $range,
            'from_date' => $from->toDateString(),
            'data' => $data
        ]);
    }
}
