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
            'table_id' => $request->table_id,
            'total_price' => 0, 
            'note' => $request->note,
        ]);

        $total = 0;

        foreach ($request->items as $item) {
            $menu = MenuItem::findOrFail($item['menu_item_id']);
            $lineTotal = floatval($menu->price) * intval($item['quantity']);

            OrderDetail::create([
                'order_id' => $order->order_id,
                'menu_item_id' => $menu->menu_item_id,
                'quantity' => $item['quantity'],
                'price' => $menu->price,
            ]);

            $total += $lineTotal;
        }

        // Lưu tổng tiền đúng đơn vị (VND)
        $order->update([
            'total_price' => $total
        ]);

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
    return Order::with(['customer', 'table', 'orderDetails.menuItem', 'payments'])
        ->orderBy('order_id', 'desc')
        ->get()
        ->map(function ($order) {
            return [
                'order_id' => $order->order_id,
                'table_id' => $order->table_id,
                'table_name' => $order->table->table_name ?? "Mang về",
                'status' => $order->status,
                'total_price' => $order->total_price,
                'note' => $order->note,
                'created_at' => $order->created_at,
                'customer' => $order->customer,
                'orderDetails' => $order->orderDetails,
            ];
        });
}


    public function show($id)
{
    $order = Order::with(['customer', 'table', 'orderDetails.menuItem', 'payments'])
        ->findOrFail($id);

    return response()->json([
        'success' => true,
        'data' => [
            'order_id' => $order->order_id,
            'table_id' => $order->table_id,
            'table_name' => $order->table->table_name ?? "Mang về",   // ⭐ QUAN TRỌNG
            'total_price' => $order->total_price,
            'status' => $order->status,
            'note' => $order->note,
            'created_at' => $order->created_at,
            'customer' => $order->customer,
            'orderDetails' => $order->orderDetails,
            'payments' => $order->payments,
        ]
    ]);
}


    public function destroy($id)
    {
        Order::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Đã xóa đơn hàng']);
    }
}
