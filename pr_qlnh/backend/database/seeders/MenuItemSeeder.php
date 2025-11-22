<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder {
    public function run(): void {
        DB::table('menu_items')->truncate();

        DB::table('menu_items')->insert([
            ['category_id' => 1, 'menu_item_name' => 'Cơm gà Hải Nam', 'price' => 55000, 'status' => 'active'],
            ['category_id' => 1, 'menu_item_name' => 'Bún bò Huế', 'price' => 60000, 'status' => 'active'],
            ['category_id' => 2, 'menu_item_name' => 'Soup cua', 'price' => 45000, 'status' => 'active'],
            ['category_id' => 3, 'menu_item_name' => 'Trà đào cam sả', 'price' => 35000, 'status' => 'active'],
            ['category_id' => 3, 'menu_item_name' => 'Cà phê sữa đá', 'price' => 25000, 'status' => 'active'],
            ['category_id' => 4, 'menu_item_name' => 'Bánh flan caramel', 'price' => 20000, 'status' => 'active'],
        ]);
    }
}

