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
    public function index()
    {
        $payments = Payment::with('order')->orderBy('payment_id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'payments' => $payments
        ]);
    }

    public function show($id)
    {
        $payment = Payment::with('order')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'payment' => $payment
        ]);
    }

    public function store(Request $req)
    {
        $req->validate([
            'order_id' => 'required|exists:orders,order_id',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric|min:0'
        ]);

        return DB::transaction(function () use ($req) {

            $order = Order::findOrFail($req->order_id);

            // Tạo payment
            $payment = Payment::create([
                'order_id' => $order->order_id,
                'amount' => $req->amount, // tiền khách TRẢ
                'payment_method' => $req->payment_method,
                'payment_status' => $req->payment_status ?? 'completed',
                'note' => $req->note ?? null
            ]);

            // Nếu đơn hàng có khách → tích điểm
            if ($order->customer_id) {

                $customer = Customer::find($order->customer_id);

                if ($customer) {

                    $paidAmount = floatval($req->amount);

                    // 10.000₫ = 1 điểm
                    $earned = floor($paidAmount / 1000);

                    // Cập nhật tổng chi tiêu
                    $customer->total_spent += $paidAmount;

                    // Cập nhật điểm
                    $customer->points += $earned;

                    $customer->save();

                    // Lưu log point
                    Point::create([
                        'customer_id' => $customer->customer_id,
                        'order_id' => $order->order_id,
                        'points' => $earned,
                        'note' => 'Tích điểm từ đơn #' . $order->order_id
                    ]);
                }
            }

            return response()->json([
                'message' => 'Payment recorded',
                'payment' => $payment
            ], 201);
        });
    }
}
