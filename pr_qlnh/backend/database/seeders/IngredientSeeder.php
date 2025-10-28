<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('ingredients')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('ingredients')->insert([
            [
                'ingredient_id' => 1,
                'ingredient_name' => 'Thịt bò',
                'unit' => 'kg',
                'price' => 250000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ingredient_id' => 2,
                'ingredient_name' => 'Rau xà lách',
                'unit' => 'bó',
                'price' => 10000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ingredient_id' => 3,
                'ingredient_name' => 'Nước mắm',
                'unit' => 'chai',
                'price' => 15000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ingredient_id' => 4,
                'ingredient_name' => 'Trứng gà',
                'unit' => 'quả',
                'price' => 4000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
