<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OnlineOrder;
use App\Models\OnlineOrderItem;

class OrderOnlineController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required',
            'phone' => 'required',
            'payment_method' => 'required',
            'total' => 'required|integer',
            'items' => 'required|array', // CHUẨN
        ]);

        $order = OnlineOrder::create([
            'customer_name' => $request->customer_name,
            'phone' => $request->phone,
            'email' => $request->email,
            'province' => $request->province,
            'district' => $request->district,
            'ward' => $request->ward,
            'address_detail' => $request->address_detail,
            'payment_method' => $request->payment_method,
            'ship_fee' => $request->ship_fee ?? 0,
            'discount' => $request->discount ?? 0,
            'subtotal' => $request->subtotal ?? 0,
            'total' => $request->total,
            'notes' => $request->notes,
            'status' => 'pending'
        ]);

        foreach ($request->items as $item) {
            OnlineOrderItem::create([
                'online_order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'note' => $item['note'] ?? null
            ]);
        }

        return response()->json([
            'message' => 'Đơn hàng online đã tạo thành công',
            'order_id' => $order->id,
        ]);
    }

    public function index(Request $request)
{
    $query = OnlineOrder::query();

    // Tìm kiếm
    if ($request->q) {
        $query->where(function ($q) use ($request) {
            $q->where('customer_name', 'like', "%{$request->q}%")
              ->orWhere('phone', 'like', "%{$request->q}%")
              ->orWhere('id', $request->q);
        });
    }

    // Lọc trạng thái
    if ($request->status && $request->status !== "") {
        $query->where('status', $request->status);
    }

    return response()->json(
        $query->orderBy('id', 'desc')->paginate(10)
    );
}


    public function show($id)
    {
        return OnlineOrder::with('items.menu')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $order = OnlineOrder::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['order' => $order]);
    }
}
