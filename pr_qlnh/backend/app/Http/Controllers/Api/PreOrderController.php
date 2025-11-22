<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PreOrder;
use App\Models\PreOrderDetail;

class PreOrderController extends Controller
{
    // ✅ Lấy danh sách đơn đặt trước
    public function index()
    {
        $orders = PreOrder::orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    // ✅ Lấy chi tiết đơn đầy đủ (dành cho hiển thị toàn bộ)
    public function show($id)
    {
        $order = PreOrder::with(['details.menuItem'])->find($id);
        return response()->json($order);
    }

    // ✅ Lấy riêng chi tiết món ăn của đơn (cho modal)
    public function showDetails($id)
    {
        $details = PreOrderDetail::with('menuItem')
            ->where('pre_order_id', $id)
            ->get()
            ->map(function ($item) {
                return [
                    'dish_name' => $item->menuItem->menu_item_name ?? 'Không xác định',
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ];
            });

        if ($details->isEmpty()) {
            return response()->json(['message' => 'Không có chi tiết đơn hàng.'], 404);
        }

        return response()->json($details);
    }

    // ✅ Cập nhật trạng thái đơn
    public function updateStatus(Request $request, $id)
    {
        $order = PreOrder::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Cập nhật trạng thái thành công']);
    }
}
