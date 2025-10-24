<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class OrderDetailSeeder extends Seeder
{
    const MAX_RECORDS = 1000; // Số bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 50; $i++) {
            DB::table('order_details')->insert([
                'order_id' => rand(1, 1000),       // 10 bản ghi orders phải có sẵn
                'menu_item_id' => rand(1, 1000),   // 15 bản ghi menu_items phải có sẵn
                'quantity' => rand(1, 5),
                'price' => rand(50, 500) * 1000,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
