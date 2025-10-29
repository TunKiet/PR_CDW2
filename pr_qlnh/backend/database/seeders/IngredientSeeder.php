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

        $units = ['kg', 'g', 'l', 'ml', 'pcs'];

        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            $price = rand(10, 200) * 1000; // Giá mua 10.000 -> 200.000
            $stockQuantity = rand(10, 100); // Số lượng trong kho
            $totalPrice = $price * $stockQuantity; // Tổng giá trị nguyên liệu
            $minStockLevel = rand(5, 20); // Mức tồn tối thiểu

            DB::table('ingredients')->insert([
                'ingredient_name' => 'Nguyên liệu ' . $i,
                'category_ingredient_id' => rand(1, 10),
                'price' => $price,
                'unit' => $units[array_rand($units)],
                'total_price' => $totalPrice,
                'stock_quantity' => $stockQuantity,
                'min_stock_level' => $minStockLevel,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
