<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointSeeder extends Seeder {
    public function run(): void {
        // Kiểm tra xem có order nào tồn tại không
        $order = DB::table('orders')->first();

        if (!$order) {
            // Nếu chưa có đơn hàng nào, tạo tạm 1 đơn để seed
            $order_id = DB::table('orders')->insertGetId([
                'customer_id' => 4,
                'total_price' => 25000,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $order_id = $order->order_id;
        }

        // Bây giờ order_id chắc chắn có giá trị
        DB::table('points')->insert([
            'customer_id' => 4,
            'order_id' => $order_id,
            'points' => 25,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
