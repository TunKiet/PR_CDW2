<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    const MAX_RECORDS = 1000; // số lượng món ăn muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('menu_items')->insert([
                'category_id' => rand(1, 100), // giả sử có 10 category
                'menu_item_name' => 'Menu Item ' . $i,
                'price' => rand(20000, 100000), // giá ngẫu nhiên 20k–100k
                'image_url' => null,
                'description' => 'Description for menu item ' . $i,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
