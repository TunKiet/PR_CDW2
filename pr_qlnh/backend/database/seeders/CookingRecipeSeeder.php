<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CookingRecipeSeeder extends Seeder
{
    const MAX_RECORDS = 1000; // số lượng bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $preparationSamples = [
            'Trộn đều các nguyên liệu.',
            'Nấu sôi 10 phút.',
            'Rang vàng nguyên liệu trước khi nấu.',
            'Ướp gia vị 30 phút trước khi nấu.',
            'Thêm rau củ cuối cùng.',
        ];

        $notesSamples = [
            'Có thể thay thế muối bằng nước mắm.',
            'Dùng nguyên liệu tươi ngon sẽ ngon hơn.',
            'Phù hợp cho 2–4 người.',
            'Có thể bảo quản trong tủ lạnh 2 ngày.',
        ];

        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            // Random menu_item_id giả sử từ 1 đến 20
            $menuItemId = rand(1, 1000);

            // Random ingredient_id giả sử từ 1 đến 20
            $ingredientId = rand(1, 1000);

            // Lượng nguyên liệu cần dùng
            $quantityNeeded = rand(50, 500) / 10; // 5.0 -> 50.0

            // Số suất có thể phục vụ
            $availableServings = rand(1, 10);

            // Chọn bước chế biến và ghi chú ngẫu nhiên
            $preparationSteps = $preparationSamples[array_rand($preparationSamples)];
            $note = $notesSamples[array_rand($notesSamples)];

            DB::table('cooking_recipes')->insert([
                'menu_item_id' => $menuItemId,
                'ingredient_id' => $ingredientId,
                'quantity_needed' => $quantityNeeded,
                'available_servings' => $availableServings,
                'preparation_steps' => $preparationSteps,
                'note' => $note,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
