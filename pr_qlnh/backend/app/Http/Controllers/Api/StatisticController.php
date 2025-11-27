<?php
// app/Http/Controllers/Api/StatisticController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Customer;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticController extends Controller
{
    /**
     * ⭐ DASHBOARD OVERVIEW (4 Cards)
     * GET /api/statistics/dashboard
     */
    public function dashboard(Request $request)
    {
        // Lấy khoảng thời gian (mặc định 30 ngày)
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        // 1. TỔNG DOANH THU 30 NGÀY
        $totalRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_price');

        // 2. TỔNG LƯỢT KHÁCH (unique customers)
        // Chú ý: Nếu customer_id nullable, cần xử lý
        $totalCustomers = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('customer_id')
            ->distinct('customer_id')
            ->count('customer_id');

        // 3. MÓN ĂN BÁN CHẠY NHẤT
        $topDish = OrderDetail::select('menu_item_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('order', function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->groupBy('menu_item_id')
            ->orderBy('total_sold', 'desc')
            ->with('menuItem')
            ->first();

        $topDishData = $topDish ? [
            'name' => $topDish->menuItem->menu_item_name,
            'sold' => $topDish->total_sold
        ] : null;

        // 4. KHÁCH HÀNG THÂN THIẾT (Top 1)
        $topCustomer = Order::select('customer_id', DB::raw('SUM(total_price) as total_spent'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('customer_id')
            ->groupBy('customer_id')
            ->orderBy('total_spent', 'desc')
            ->with('customer')
            ->first();

        $topCustomerData = $topCustomer ? [
            'name' => $topCustomer->customer->name ?? 'N/A',
            'total_spent' => (float) $topCustomer->total_spent
        ] : null;

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_revenue' => (float) $totalRevenue,
                'total_customers' => $totalCustomers,
                'top_dish' => $topDishData,
                'top_customer' => $topCustomerData,
            ]
        ]);
    }

    /**
     * ⭐ DOANH THU 30 NGÀY (Line Chart)
     * GET /api/statistics/revenue-chart
     */
    public function revenueChart(Request $request)
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        // Lấy doanh thu theo ngày
        $revenueByDay = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COALESCE(SUM(total_price), 0) as total')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Format dữ liệu cho chart (giống Frontend mẫu của bạn)
        $chartData = $revenueByDay->map(function($item) {
            return [
                'name' => Carbon::parse($item->date)->format('d M'), // "26 Nov"
                'value' => round((float) $item->total / 1000000, 2) // Đổi sang triệu
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $chartData
        ]);
    }

    /**
     * ⭐ TOP 5 MÓN ĂN BÁN CHẠY (Bar Chart)
     * GET /api/statistics/top-dishes
     */
    public function topDishes(Request $request)
    {
        $days = $request->get('days', 30);
        $limit = $request->get('limit', 5);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $topDishes = OrderDetail::select('menu_item_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('order', function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->groupBy('menu_item_id')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->with('menuItem')
            ->get();

        // Format dữ liệu cho chart (khớp với Frontend)
        $chartData = $topDishes->map(function($item) {
            return [
                'name' => $item->menuItem->menu_item_name,
                'sold' => (int) $item->total_sold
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $chartData
        ]);
    }

    /**
     * ⭐ SO SÁNH THÁNG TRƯỚC (Tính % tăng/giảm)
     * GET /api/statistics/comparison
     */
    public function comparison()
    {
        // Tháng này
        $thisMonthStart = Carbon::now()->startOfMonth();
        $thisMonthEnd = Carbon::now()->endOfMonth();
        
        $thisMonthRevenue = Order::whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
            ->sum('total_price');

        $thisMonthCustomers = Order::whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
            ->whereNotNull('customer_id')
            ->distinct('customer_id')
            ->count('customer_id');

        // Tháng trước
        $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        
        $lastMonthRevenue = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->sum('total_price');

        $lastMonthCustomers = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->whereNotNull('customer_id')
            ->distinct('customer_id')
            ->count('customer_id');

        // Tính % tăng/giảm
        $revenueChange = $lastMonthRevenue > 0 
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        $customersChange = $lastMonthCustomers > 0
            ? round((($thisMonthCustomers - $lastMonthCustomers) / $lastMonthCustomers) * 100, 1)
            : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'revenue_change_percent' => $revenueChange,
                'customers_change_percent' => $customersChange,
                'this_month' => [
                    'revenue' => (float) $thisMonthRevenue,
                    'customers' => $thisMonthCustomers
                ],
                'last_month' => [
                    'revenue' => (float) $lastMonthRevenue,
                    'customers' => $lastMonthCustomers
                ]
            ]
        ]);
    }

    /**
     * ⭐ TOP KHÁCH HÀNG THÂN THIẾT
     * GET /api/statistics/top-customers
     */
    public function topCustomers(Request $request)
    {
        $days = $request->get('days', 30);
        $limit = $request->get('limit', 10);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $topCustomers = Order::select(
                'customer_id', 
                DB::raw('SUM(total_price) as total_spent'), 
                DB::raw('COUNT(*) as order_count')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('customer_id')
            ->groupBy('customer_id')
            ->orderBy('total_spent', 'desc')
            ->limit($limit)
            ->with('customer')
            ->get();

        $data = $topCustomers->map(function($item, $index) {
            return [
                'rank' => $index + 1,
                'customer_id' => $item->customer_id,
                'name' => $item->customer->name ?? 'N/A',
                'phone' => $item->customer->phone ?? 'N/A',
                'total_spent' => (float) $item->total_spent,
                'order_count' => $item->order_count
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * ⭐ THỐNG KÊ TỔNG QUAN (Thêm cho đầy đủ)
     * GET /api/statistics/summary
     */
    public function summary(Request $request)
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $totalOrders = Order::whereBetween('created_at', [$startDate, $endDate])->count();
        $totalRevenue = Order::whereBetween('created_at', [$startDate, $endDate])->sum('total_price');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        
        $totalDishes = MenuItem::count();
        $totalCustomers = Customer::count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_orders' => $totalOrders,
                'total_revenue' => (float) $totalRevenue,
                'average_order_value' => round($averageOrderValue, 2),
                'total_dishes' => $totalDishes,
                'total_customers' => $totalCustomers,
                'period_days' => $days
            ]
        ]);
    }
}