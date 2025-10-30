<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CookingRecipeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cooking_recipes')->truncate();

        $menuItemIds = DB::table('menu_items')->pluck('menu_item_id');
        $ingredientIds = DB::table('ingredients')->pluck('ingredient_id');

        if ($menuItemIds->isEmpty() || $ingredientIds->isEmpty()) {
            return; // không seed nếu thiếu dữ liệu cha
        }

        DB::table('cooking_recipes')->insert([
            [
                'menu_item_id' => $menuItemIds->random(),
                'ingredient_id' => $ingredientIds->random(),
                'quantity_needed' => 46.2,
                'available_servings' => 7,
                'preparation_steps' => 'Trộn đều các nguyên liệu.',
                'note' => 'Có thể bảo quản trong tủ lạnh 2 ngày.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
