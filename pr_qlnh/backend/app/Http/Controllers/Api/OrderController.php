<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Customer;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * 🧩 Tạo đơn hàng mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,customer_id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,menu_item_id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'customer_id' => $request->customer_id,
                'total_price' => 0,
            ]);

            $total = 0;

            foreach ($request->items as $item) {
                $menu = MenuItem::findOrFail($item['menu_item_id']);
                $price = $menu->price;
                $quantity = $item['quantity'];

                OrderDetail::create([
                    'order_id' => $order->order_id,
                    'menu_item_id' => $menu->menu_item_id,
                    'quantity' => $quantity,
                    'price' => $price,
                ]);

                $total += $price * $quantity;
            }

            $order->update(['total_price' => $total]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng được tạo thành công',
                'data' => $order->load(['customer', 'orderDetails.menuItem', 'payments'])

            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📋 Danh sách tất cả đơn hàng
     */
    public function index()
    {
        $orders = Order::with(['customer', 'orderDetails.menuItem', 'payments'])
            ->orderBy('order_id', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * 📄 Chi tiết một đơn hàng
     */
    public function show($id)
    {
        $order = Order::with(['customer', 'orderDetails.menuItem', 'payments'])
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * ❌ Xóa đơn hàng
     */
    public function destroy($id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->delete();

            return response()->json(['success' => true, 'message' => 'Đơn hàng đã bị xóa']);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
}
