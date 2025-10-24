<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PurchaseOrderItemSeeder extends Seeder
{
    const MAX_RECORDS = 1000; // số lượng bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            // Random purchase_order_id giả sử từ 1 đến 15 (tương ứng PurchaseOrderSeeder)
            $purchaseOrderId = rand(1, 1000);

            // Random ingredient_id giả sử từ 1 đến 20 (tương ứng IngredientSeeder)
            $ingredientId = rand(1,  1000);

            // Số lượng nguyên liệu mua
            $quantity = rand(1, 50); // có thể là kg, pcs,…

            // Giá mua (lấy ngẫu nhiên từ 10.000 -> 200.000)
            $price = rand(10, 200) * 1000;

            DB::table('purchase_order_items')->insert([
                'purchase_order_id' => $purchaseOrderId,
                'ingredient_id' => $ingredientId,
                'quantity' => $quantity,
                'price' => $price,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
