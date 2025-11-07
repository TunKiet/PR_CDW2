<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PreOrder;
use App\Models\PreOrderDetail;
use Illuminate\Support\Facades\DB;

class PreOrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pre_order_details')->truncate();
        DB::table('pre_orders')->truncate();

        // ✅ Tạo đơn hàng mẫu
        $order = PreOrder::create([
            'order_code' => 'DH001',
            'customer_name' => 'Nguyễn Văn A',
            'order_datetime' => now(),
            'total_amount' => 115000,
            'deposit_amount' => 50000,
            'status' => 'pending',
        ]);

        // ✅ Tạo chi tiết đơn hàng
        PreOrderDetail::insert([
            [
                'pre_order_id' => $order->pre_order_id,
                'menu_item_id' => 1,
                'quantity' => 2,
                'price' => 35000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pre_order_id' => $order->pre_order_id,
                'menu_item_id' => 2,
                'quantity' => 1,
                'price' => 45000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
