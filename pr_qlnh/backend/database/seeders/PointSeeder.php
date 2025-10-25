<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointSeeder extends Seeder
{
    const MAX_RECORDS = 20; // số lượng bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            // Random user_id giả sử từ 1 đến 10
            $userId = rand(1, 10);

            // Random order_id giả sử từ 1 đến 20
            $orderId = rand(1, 20);

            // Số điểm thưởng từ 10 đến 100
            $points = rand(10, 100);

            DB::table('points')->insert([
                'user_id' => $userId,
                'order_id' => $orderId,
                'points' => $points,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
