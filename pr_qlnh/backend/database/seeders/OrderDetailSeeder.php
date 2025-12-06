<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // ⬅️ Thêm thư viện Carbon

class OrderDetailSeeder extends Seeder {
    public function run(): void {
        DB::table('order_details')->truncate();

        // 1. Định nghĩa thời gian hiện tại
        $now = Carbon::now();

        // 2. Thêm created_at và updated_at vào từng bản ghi
        DB::table('order_details')->insert([
            [
                'order_id' => 1, 
                'menu_item_id' => 1, 
                'quantity' => 2, 
                'price' => 110000,
                'created_at' => $now->copy()->subHours(5), // Ví dụ: 5 tiếng trước
                'updated_at' => $now->copy()->subHours(5),
            ],
            [
                'order_id' => 1, 
                'menu_item_id' => 3, 
                'quantity' => 2, 
                'price' => 70000,
                'created_at' => $now->copy()->subHours(5),
                'updated_at' => $now->copy()->subHours(5),
            ],
            [
                'order_id' => 2, 
                'menu_item_id' => 4, 
                'quantity' => 3, 
                'price' => 75000,
                'created_at' => $now->copy()->subHours(10), // Ví dụ: 10 tiếng trước
                'updated_at' => $now->copy()->subHours(10),
            ],
            [
                'order_id' => 3, 
                'menu_item_id' => 2, 
                'quantity' => 2, 
                'price' => 120000,
                'created_at' => $now->copy()->subDays(2), // Ví dụ: 2 ngày trước
                'updated_at' => $now->copy()->subDays(2),
            ],
        ]);
    }
}