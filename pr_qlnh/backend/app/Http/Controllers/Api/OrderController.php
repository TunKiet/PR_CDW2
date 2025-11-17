<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,customer_id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,menu_item_id',
            'items.*.quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'customer_id' => $request->customer_id,
                'total_price' => 0,
                'note' => $request->note,
            ]);

            $total = 0;

            foreach ($request->items as $item) {
                $menu = MenuItem::findOrFail($item['menu_item_id']);
                $lineTotal = $menu->price * $item['quantity'];

                OrderDetail::create([
                    'order_id' => $order->order_id,
                    'menu_item_id' => $menu->menu_item_id,
                    'quantity' => $item['quantity'],
                    'price' => $menu->price,
                ]);

                $total += $lineTotal;
            }

            $order->update(['total_price' => $total]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng tạo thành công',
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

    public function index()
    {
        return Order::with(['customer', 'orderDetails.menuItem', 'payments'])
            ->orderBy('order_id', 'desc')
            ->get();
    }

    public function show($id)
    {
        return Order::with(['customer', 'orderDetails.menuItem', 'payments'])
            ->findOrFail($id);
    }

    public function destroy($id)
    {
        Order::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Đã xóa đơn hàng']);
    }
}
