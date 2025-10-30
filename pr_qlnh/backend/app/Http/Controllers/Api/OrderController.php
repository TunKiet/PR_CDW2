<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    // ✅ POST /api/orders
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'table_id' => 'nullable|exists:tables,table_id',
            'reservation_id' => 'nullable|exists:reservations,reservation_id',
            'total_price' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:20',
            'payment_status' => 'nullable|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,menu_item_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        try {
            $order = DB::transaction(function () use ($validated) {
                // Tạo đơn hàng
                $order = Order::create([
                    'user_id' => $validated['user_id'],
                    'table_id' => $validated['table_id'] ?? null,
                    'reservation_id' => $validated['reservation_id'] ?? null,
                    'total_price' => $validated['total_price'],
                    'payment_method' => $validated['payment_method'] ?? 'cash',
                    'payment_status' => $validated['payment_status'] ?? 'pending',
                ]);

                // Thêm chi tiết đơn hàng
                foreach ($validated['items'] as $item) {
                    OrderDetail::create([
                        'order_id' => $order->order_id,
                        'menu_item_id' => $item['menu_item_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                return $order->load('details.menuItem');
            });

            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng tạo thành công!',
                'data' => $order,
            ], 201);

        } catch (\Throwable $e) {
            Log::error('Lỗi tạo đơn hàng: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Không thể tạo đơn hàng!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}