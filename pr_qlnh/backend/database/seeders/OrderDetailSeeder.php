<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderDetailSeeder extends Seeder {
    public function run(): void {
        DB::table('order_details')->truncate();

        DB::table('order_details')->insert([
            ['order_id' => 1, 'menu_item_id' => 1, 'quantity' => 2, 'price' => 110000],
            ['order_id' => 1, 'menu_item_id' => 3, 'quantity' => 2, 'price' => 70000],
            ['order_id' => 2, 'menu_item_id' => 4, 'quantity' => 3, 'price' => 75000],
            ['order_id' => 3, 'menu_item_id' => 2, 'quantity' => 2, 'price' => 120000],
        ]);
    }
}
