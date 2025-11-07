<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    public function index()
    {
        return response()->json(OrderDetail::with(['order', 'menuItem'])->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,order_id',
            'menu_item_id' => 'required|exists:menu_items,menu_item_id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $orderDetail = OrderDetail::create($data);

        return response()->json($orderDetail, 201);
    }

    public function show($id)
    {
        $detail = OrderDetail::with(['order', 'menuItem'])->findOrFail($id);
        return response()->json($detail);
    }

    public function update(Request $request, $id)
    {
        $orderDetail = OrderDetail::findOrFail($id);

        $data = $request->validate([
            'quantity' => 'integer|min:1',
            'price' => 'numeric|min:0',
        ]);

        $orderDetail->update($data);

        return response()->json($orderDetail);
    }

    public function destroy($id)
    {
        $orderDetail = OrderDetail::findOrFail($id);
        $orderDetail->delete();

        return response()->json(['message' => 'Order detail deleted successfully']);
    }
}
