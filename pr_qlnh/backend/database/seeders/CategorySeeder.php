<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder {
    public function run(): void {
        DB::table('categories')->truncate();

        DB::table('categories')->insert([
            ['category_name' => 'Món chính', 'description' => 'Các món ăn chính trong bữa ăn'],
            ['category_name' => 'Món khai vị', 'description' => 'Các món ăn khai vị'],
            ['category_name' => 'Đồ uống', 'description' => 'Cà phê, trà, nước ép...'],
            ['category_name' => 'Tráng miệng', 'description' => 'Các món ngọt sau bữa chính'],
        ]);
    }
}
