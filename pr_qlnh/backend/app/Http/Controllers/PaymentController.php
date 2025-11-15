<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Payment;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Point;

class PaymentController extends Controller {
    public function index() {
        $payments = Payment::with('order')->orderBy('payment_id','desc')->get();
        return response()->json(['status'=>'success','payments'=>$payments]);
    }

    public function show($id) {
        $payment = Payment::with('order')->findOrFail($id);
        return response()->json(['status'=>'success','payment'=>$payment]);
    }

    public function store(Request $req) {
        $req->validate([
            'order_id' => 'required|exists:orders,order_id',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric|min:0'
        ]);

        return DB::transaction(function() use ($req) {
            $order = Order::findOrFail($req->order_id);

            $payment = Payment::create([
                'order_id' => $order->order_id,
                'amount' => $req->amount,
                'payment_method' => $req->payment_method,
                // 'paid_at' => now(),
                'payment_status' => $req->payment_status ?? 'completed',
                'note' => $req->note ?? null
            ]);

            // Cập nhật order trạng thái
            // $order->payment_status = 'paid';
            // $order->payment_method = $req->payment_method;
            // $order->save();

            // Tích điểm cho khách (nếu có customer)
            if ($order->customer_id) {
                $points = floor(floatval($req->amount) / 1000); // 1 điểm / 1000đ
                if ($points > 0) {
                    // cập nhật tổng điểm
                    $customer = Customer::find($order->customer_id);
                    if ($customer) {
                        $customer->increment('points', $points);

                        // lưu log points
                        Point::create([
                            'customer_id' => $customer->customer_id,
                            'order_id' => $order->order_id,
                            'points' => $points,
                            'note' => 'Tích điểm từ đơn #' . $order->order_id
                        ]);
                    }
                }
            }

            return response()->json(['message'=>'Payment recorded','payment'=>$payment], 201);
        });
    }
}
