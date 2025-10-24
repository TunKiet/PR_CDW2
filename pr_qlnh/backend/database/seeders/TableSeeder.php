<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder
{
    const MAX_RECORDS = 1000; // số lượng bàn muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('tables')->insert([
                'table_name' => 'Table ' . $i,
                'table_type' => $i % 2 === 0 ? 'VIP' : 'Normal',
                'capacity' => rand(2, 10),
                'note' => 'Note for table ' . $i,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
