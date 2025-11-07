<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder {
    public function run(): void {
        DB::table('tables')->truncate();

        for ($i = 1; $i <= 8; $i++) {
            DB::table('tables')->insert([
                'table_name' => "Bàn số $i",
                'table_type' => $i <= 6 ? 'Normal' : 'VIP',
                'capacity' => $i <= 6 ? 4 : 8,
                'status' => 'available',
            ]);
        }
    }
}

