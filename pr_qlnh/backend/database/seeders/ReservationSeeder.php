<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationSeeder extends Seeder {
    public function run(): void {
        DB::table('reservations')->truncate();

        DB::table('reservations')->insert([
            [
                'table_id' => 1,
                'customer_id' => 1,
                'user_id' => null,
                'reservation_date' => '2025-11-10',
                'reservation_time' => '18:30:00',
                'num_guests' => 4,
                'deposit_amount' => 100000,
                'note' => 'Sinh nhật bạn bè',
                'status' => 'confirmed',
            ],
        ]);
    }
}
