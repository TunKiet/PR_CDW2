<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Tạm tắt kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // ✅ Xóa dữ liệu cũ thay vì truncate
        DB::table('categories')->delete();

        // ✅ Chèn lại dữ liệu mẫu
        DB::table('categories')->insert([
            ['category_id' => 1, 'category_name' => 'Món chính', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'category_name' => 'Đồ uống', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 3, 'category_name' => 'Món khai vị', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 4, 'category_name' => 'Tráng miệng', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 5, 'category_name' => 'Hải sản', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ✅ Bật lại kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
