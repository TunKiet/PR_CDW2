<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CookingRecipeSeeder extends Seeder
{

    const MAX_RECORDS = 100;
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('cooking_recipes')->insert([
                [
                    'menu_item_id' => rand(1, 20),
                    'ingredient_id' => rand(1, 20),
                    'quantity_needed' => rand(1, 10),
                    'available_servings' => $i,
                    'preparation_steps' => 'Trộn đều các nguyên liệu.',
                    'note' => 'Có thể bảo quản trong tủ lạnh 2 ngày.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

    }
}
