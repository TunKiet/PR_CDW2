<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoryIngredientSeeder extends Seeder
{
    const MAX_RECORDS = 10; // Số lượng bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('category_ingredients')->insert([
                'category_ingredient_name' => 'Nguyên liệu nhóm ' . $i,
                'description' => 'Mô tả cho nguyên liệu nhóm ' . $i . ' - ' . Str::random(20),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
