<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    const MAX_RECORDS = 20;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = ['cash', 'card', 'momo'];
        $paymentStatuses = ['pending', 'paid', 'failed'];

        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            // Random user_id giả sử từ 1 đến 10
            $userId = rand(1, 10);

            // Random table_id và reservation_id (nullable)
            $tableId = rand(1, 15);
            $reservationId = rand(1, 20);

            // Tổng tiền random từ 100.000 đến 5.000.000
            $totalPrice = rand(100, 5000) * 1000;

            // Payment method & status random
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            $paymentStatus = $paymentStatuses[array_rand($paymentStatuses)];

            DB::table('orders')->insert([
                'user_id' => $userId,
                'table_id' => $tableId,
                'reservation_id' => $reservationId,
                'total_price' => $totalPrice,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
