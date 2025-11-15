<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Promotion;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,order_id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'promotion_id' => 'nullable|exists:promotions,promotion_id'
        ]);

        try {
            DB::beginTransaction();

            $order = Order::with('customer')->findOrFail($request->order_id);
            $amount = $request->amount;
            $promotionDiscount = 0;

            if ($request->promotion_id) {
                $promotion = Promotion::find($request->promotion_id);

                if ($promotion && $promotion->status === 'active') {
                    $promotionDiscount = ($order->total_price * $promotion->discount_percent) / 100;
                    $amount -= $promotionDiscount;
                }
            }

            $payment = Payment::create([
                'order_id' => $order->order_id,
                'amount' => $amount,
                'payment_method' => $request->payment_method ?? 'cash',
                'payment_status' => 'completed',
                'note' => $promotionDiscount > 0 ? "Giảm {$promotionDiscount}đ (khuyến mãi)" : null,
            ]);

            if ($order->customer_id) {
                $customer = Customer::find($order->customer_id);

                if ($customer) {
                    // ✔ Cộng tổng chi tiêu
                    $customer->total_spent += $amount;

                    // ✔ 1.000đ = 1 điểm
                    $pointsEarned = floor($amount / 1000);

                    // ✔ Cộng điểm tích lũy
                    $customer->points += $pointsEarned;

                    $customer->save();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Thanh toán thành công',
                'data' => [
                    'payment' => $payment,
                    'points_added' => $pointsEarned ?? 0,
                    'discount' => $promotionDiscount,
                ]
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi thanh toán: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        return Payment::with('order.customer')->latest()->get();
    }

    public function show($id)
    {
        return Payment::with('order.customer')->findOrFail($id);
    }
}
