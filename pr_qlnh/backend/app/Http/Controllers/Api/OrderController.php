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
                'voucher' => $request->voucher,              // ✔ Lưu voucher đúng
                'discount' => $request->discount ?? 0,       // ✔ Voucher giảm giá
                'rank_discount' => $request->rank_discount ?? 0,
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

            $finalTotal = $total - ($request->discount ?? 0) - ($request->rank_discount ?? 0);

            $order->update([
                'total_price' => $finalTotal
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng tạo thành công',
                'data' => $order->load(['customer', 'orderDetails.menuItem', 'payments'])
            ]);
        } 
        catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }

>>>>>>> Loc/f3/OrderManageentPage

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

                'discount' => $order->discount !== null ? floatval($order->discount) : 0,
                'rank_discount' => $order->rank_discount !== null ? floatval($order->rank_discount) : 0,
                'voucher' => $order->voucher ?: null,

    
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
            'table_name' => $order->table->table_name ?? "Mang về",  
            'total_price' => $order->total_price,
            'status' => $order->status,
            'note' => $order->note,
            'created_at' => $order->created_at,
            'voucher' => $order->voucher,
'discount' => $order->discount,
'rank_discount' => $order->rank_discount,

            'customer' => $order->customer,
            'orderDetails' => $order->orderDetails,
            'payments' => $order->payments,
        ]
    ]);
}


   public function destroy(Request $req, $id)
{
    // Nếu chưa dùng login thì tắt phân quyền
    // $user = $req->user();
    // if (!$user || $user->role !== 'admin') {
    //     return response()->json(['message' => 'Bạn không có quyền xóa đơn hàng.'], 403);
    // }

    $order = Order::with(['orderDetails', 'customer'])->find($id);

    if (!$order) {
        return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
    }

    DB::transaction(function () use ($order) {

        // ====== 1) TRỪ ĐIỂM KHÁCH HÀNG (NẾU CÓ) ======
        if ($order->customer) {

           
            // 1 điểm cho mỗi 1000 VNĐ
            $pointsAdded = floor($order->total_price / 1000);

            $newPoints = max(0, $order->customer->points - $pointsAdded);

            $order->customer->update([
                'points' => $newPoints,
            ]);
        }

        // ====== 2) XÓA ORDER DETAILS ======
        $order->orderDetails()->delete();

        // ====== 3) XÓA PAYMENT ======
        $order->payments()->delete();

        // ====== 4) XÓA ORDER ======
        $order->delete();
    });

    return response()->json(['message' => 'Đã xóa đơn hàng & cập nhật điểm khách hàng']);
}


public function update(Request $req, $id)
    {
        $req->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,menu_item_id',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255'
        ]);

        $order = Order::findOrFail($id);

        DB::transaction(function () use ($order, $req) {

            $order->orderDetails()->delete();

            $total = 0;

            foreach ($req->items as $it) {
                $lineTotal = $it['price'] * $it['quantity'];
                $total += $lineTotal;

                $order->orderDetails()->create([
                    'menu_item_id' => $it['menu_item_id'],
                    'quantity' => $it['quantity'],
                    'price' => $it['price']
                ]);
            }

            // ✔ Sửa lỗi lấy nhầm voucher
            $voucher = $req->voucher ?? $order->voucher;

            $discount = $req->discount ?? $order->discount;
            $rank = $req->rank_discount ?? $order->rank_discount;

            $finalTotal = $total - $discount - $rank;

            $order->update([
                'total_price' => $finalTotal,
                'note' => $req->note ?? $order->note,
                'voucher' => $voucher,              // ✔ Lưu đúng voucher
                'discount' => $discount,
                'rank_discount' => $rank,
            ]);
        });

        return response()->json([
            'message' => 'Cập nhật đơn hàng thành công.',
            'order' => $order->load('orderDetails.menuItem')
        ]);
    }

public function exportPdf($id)
{
    $order = Order::with(['orderDetails.menuItem', 'table'])
        ->findOrFail($id);

    return view('pdf.order-html', compact('order'));
}


}
