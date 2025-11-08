<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Order;
use App\Models\Point;
use App\Models\Customer;
use App\Models\Promotion;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * 💸 Thanh toán đơn hàng + cộng điểm thưởng
     */
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

            // 🎁 Áp dụng khuyến mãi (nếu có)
            if ($request->promotion_id) {
                $promotion = Promotion::find($request->promotion_id);
                if ($promotion && $promotion->status === 'active') {
                    $promotionDiscount = ($order->total_price * $promotion->discount_percent) / 100;
                    $amount -= $promotionDiscount;
                }
            }

            // 💳 Lưu thanh toán
            $payment = Payment::create([
                'order_id' => $order->order_id,
                'amount' => $amount,
                'payment_method' => $request->payment_method ?? 'cash',
                'payment_status' => 'completed',
                'note' => $promotionDiscount > 0 ? "Giảm {$promotionDiscount}đ (khuyến mãi)" : null,
            ]);

            // ⭐ Cộng điểm thưởng (1% tổng thanh toán)
            if ($order->customer_id) {
                $pointsEarned = floor($amount / 100); // ví dụ: 1 điểm / 100đ
                Point::create([
                    'customer_id' => $order->customer_id,
                    'order_id' => $order->order_id,
                    'points' => $pointsEarned,
                ]);

                // Cập nhật tổng điểm KH
                $customer = Customer::find($order->customer_id);
                $customer->increment('points', $pointsEarned);
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
                'message' => 'Lỗi khi thanh toán: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📋 Danh sách thanh toán
     */
    public function index()
    {
        $payments = Payment::with('order.customer')->latest()->get();
        return response()->json($payments);
    }

    /**
     * 📄 Chi tiết thanh toán
     */
    public function show($id)
    {
        $payment = Payment::with('order.customer')->findOrFail($id);
        return response()->json($payment);
    }
}
