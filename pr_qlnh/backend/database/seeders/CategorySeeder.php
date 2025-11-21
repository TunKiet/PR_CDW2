<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Tạm tắt kiểm tra khóa ngoại (Tốt cho việc Seed)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Xóa dữ liệu cũ
        DB::table('categories')->truncate(); 

        // Định nghĩa dữ liệu mẫu
        $categories = [
            'Món chính',
            'Đồ uống',
            'Món khai vị',
            'Tráng miệng',
            'Hải sản',
            'Đồ ăn vặt', // Thêm một vài danh mục mới
            'Khuyến mãi', // Thêm một danh mục có thể ẩn
        ];

        // Chuẩn bị mảng dữ liệu để chèn
        $dataToInsert = [];
        $baseId = 1;

        foreach ($categories as $name) {
            $dataToInsert[] = [
                'category_id' => $baseId++,
                'category_name' => $name,
                // Tự động tạo slug từ tên danh mục
                'slug' => Str::slug($name), 
                // Description: Tùy chọn, để null hoặc chuỗi rỗng
                'description' => null, 
                // is_hidden: Mặc định là false (Hiển thị)
                'is_hidden' => $name === 'Khuyến mãi' ? true : false, // Đặt "Khuyến mãi" là ẩn để kiểm tra
                'created_at' => now(), 
                'updated_at' => now(),
            ];
        }

        // Chèn dữ liệu đã chuẩn bị
        DB::table('categories')->insert($dataToInsert);

        // Bật lại kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}