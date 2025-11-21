<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrderSeeder extends Seeder {
    public function run(): void {
        Schema::disableForeignKeyConstraints();
        DB::table('orders')->truncate();

        DB::table('orders')->insert([
            ['customer_id' => 1, 'total_price' => 180000],
            ['customer_id' => 2, 'total_price' => 90000],
            ['customer_id' => 3, 'total_price' => 150000],
        ]);
        Schema::enableForeignKeyConstraints();
    }
}

