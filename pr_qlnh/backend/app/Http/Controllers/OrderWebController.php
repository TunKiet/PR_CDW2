<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Payment;
use App\Models\Point;

class OrderWebController extends Controller
{
    public function create()
    {
        $categories = Category::with('menuItems')->get();
        $customers = Customer::all();
        return view('orders.create', compact('categories', 'customers'));
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $customerId = $request->customer_id;
            $cart = $request->cart; // mảng: [menu_item_id, quantity, price]

            // ✅ Tạo đơn hàng
            $order = Order::create([
                'customer_id' => $customerId,
                'total_price' => collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']),
            ]);

            // ✅ Lưu chi tiết đơn
            foreach ($cart as $item) {
                OrderDetail::create([
                    'order_id' => $order->order_id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            // ✅ Thanh toán
            Payment::create([
                'order_id' => $order->order_id,
                'amount' => $order->total_price,
                'payment_method' => $request->payment_method ?? 'cash',
                'payment_status' => 'completed',
            ]);

            // ✅ Tích điểm (1% giá trị hóa đơn)
            if ($customerId) {
                $pointsEarned = floor($order->total_price / 100); // 1 điểm mỗi 100đ
                Point::create([
                    'customer_id' => $customerId,
                    'order_id' => $order->order_id,
                    'points' => $pointsEarned,
                ]);

                DB::table('customers')->where('customer_id', $customerId)
                    ->increment('points', $pointsEarned);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Thanh toán thành công!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Lỗi: ' . $e->getMessage());
        }
    }
}
