<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointSeeder extends Seeder {
    public function run(): void {
        DB::table('points')->insert([
            ['customer_id' => 4, 'order_id' => null, 'points' => 25],
        ]);
    }
}
