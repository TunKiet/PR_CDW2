<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder
{
    const MAX_RECORDS = 15; // số lượng bàn muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('tables')->insert([
                'table_name' => "Bàn số $i",
                'table_type' => $i <= 6 ? 'Normal' : 'VIP',
                'capacity' => $i <= 6 ? 4 : 8,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
