<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder {
    public function run(): void {
        DB::table('payments')->truncate();
        DB::table('points')->truncate();

        $payments = [
            ['order_id' => 1, 'amount' => 180000, 'payment_method' => 'cash', 'payment_status' => 'completed'],
            ['order_id' => 2, 'amount' => 90000, 'payment_method' => 'card', 'payment_status' => 'completed'],
            ['order_id' => 3, 'amount' => 150000, 'payment_method' => 'momo', 'payment_status' => 'completed'],
        ];

        foreach ($payments as $p) {
            DB::table('payments')->insert($p);
            $order = DB::table('orders')->where('order_id', $p['order_id'])->first();

            if ($order && $order->customer_id) {
                $points = floor($p['amount'] / 1000);
                DB::table('points')->insert([
                    'customer_id' => $order->customer_id,
                    'order_id' => $order->order_id,
                    'points' => $points,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('customers')->where('customer_id', $order->customer_id)->increment('points', $points);
            }
        }
    }
}
