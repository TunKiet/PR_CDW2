<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    const MAX_RECORDS = 50; // Số lượng món ăn muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('menu_items')->insert([
                'category_id' => rand(1, 5), // Giả định có 5 danh mục
                'menu_item_name' => 'Món ăn ' . $i,
                'price' => rand(30, 200) * 1000,
                'image_url' => '/images/menu-item-' . $i . '.jpg', // ✅ đúng cột trong DB
                'description' => 'Món ăn số ' . $i . ' được chế biến theo phong cách đặc biệt.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
        }
    }
}
