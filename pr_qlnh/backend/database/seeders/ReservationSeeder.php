<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ReservationSeeder extends Seeder
{
    const MAX_RECORDS = 20;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('reservations')->insert([
                'user_id' => rand(1, 10),
                'table_id' => rand(1, 15),
                'reservation_date' => '2025-12-12',   // ngày cố định
                'reservation_time' => '12:00:00',
                'num_guests' => rand(2, 8),
                'deposit_amount' => rand(100, 500) * 1000,
                'note' => 'Đặt bàn số ' . $i,
                'status' => ['pending', 'confirmed', 'completed', 'cancelled'][rand(0, 3)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
