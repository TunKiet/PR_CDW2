<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategoryTableSeeder extends Seeder
{
    /**
     * Chạy quá trình seed database.
     */
    public function run()
    {
        // Xóa dữ liệu cũ trong bảng 'categories'
        // Bật/tắt FOREIGN_KEY_CHECKS nên được xử lý trong DatabaseSeeder để bao quát tất cả Seeder.
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('categories')->truncate(); 

        $now = Carbon::now();

        $categories = [
            [
                'category_id' => 1,
                'category_name' => 'Món Chính',
                'description' => 'Các món ăn no bụng như Phở, Cơm, Bún.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 2,
                'category_name' => 'Đồ Ăn Nhanh',
                'description' => 'Các loại thức ăn nhanh như Pizza, Burger, Khoai Tây Chiên.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 3,
                'category_name' => 'Đồ Uống',
                'description' => 'Các loại đồ uống giải khát, cà phê và trà sữa.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 4,
                'category_name' => 'Tráng Miệng',
                'description' => 'Các loại chè, kem, và bánh ngọt.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        // Chèn dữ liệu vào bảng 'categories'
        DB::table('categories')->insert($categories);
    }
}
