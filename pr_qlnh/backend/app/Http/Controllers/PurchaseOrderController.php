<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class PurchaseOrderController extends Controller
{
    public function getReceivedOrders()
    {

        $cacheKey = 'received_orders_' . date('Y_m');

        try {
            $orders = PurchaseOrder::getIngredientImport();

            return response()->json([
                'status' => true,
                'message' => 'Import thành công',
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            Log::error('Received Orders Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // Validate
        $request->validate([
            'supplier_name' => 'required|string',
            'total_cost' => 'required|numeric',
            'order_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.ingredient_id' => 'required|integer|exists:ingredients,ingredient_id',
            'items.*.quantity' => 'required|numeric|min:0.1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        try {
            // 1️⃣ Tạo đơn hàng
            $order = PurchaseOrder::create([
                'supplier_name' => $request->supplier_name,
                'total_cost' => $request->total_cost,
                'status' => 'ordered',
                'order_date' => $request->order_date,  // ngày giao hàng
            ]);

            // 2️⃣ Lưu danh sách nguyên liệu
            foreach ($request->items as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $order->purchase_order_id,
                    'ingredient_id' => $item['ingredient_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔹 API tổng quan đơn hàng
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $data = PurchaseOrder::getSummary($perPage);

        return response()->json($data);
    }


    // 🔹 API chi tiết đơn hàng
    public function show($id)
    {
        $orderDetail = PurchaseOrder::getOrderDetail($id);
        if (!$orderDetail) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }
        return response()->json($orderDetail);
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:ordered,pending,shipping,received,cancelled',
        ]);

        $order = PurchaseOrder::findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $request->status;

        $order->status = $newStatus;
        $order->save();

        // Nếu trạng thái vừa chuyển sang received
        if ($oldStatus !== 'received' && $newStatus === 'received') {
            // Lấy tất cả items trong đơn
            $items = PurchaseOrderItem::where('purchase_order_id', $id)->get();

            foreach ($items as $item) {
                $ingredient = Ingredient::find($item->ingredient_id);
                if ($ingredient) {
                    $ingredient->stock_quantity += $item->quantity; // cộng số lượng
                    $ingredient->total_price = $ingredient->price * $ingredient->stock_quantity; // cập nhật tổng tiền
                    $ingredient->save();
                }
            }
        }

        return response()->json(['success' => true, 'status' => $newStatus]);
    }
}
