<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Giả định Model Menu_Item tồn tại
use App\Models\Menu_Item; 
// Giả định Model Category tồn tại để lấy category_id
use App\Models\Category; 


class Menu_ItemsSeeder extends Seeder
{
    /**
     * Chạy quá trình seed database.
     */
    public function run()
    {
        // 1. Tạm thời vô hiệu hóa kiểm tra khóa ngoại (BẮT BUỘC để TRUNCATE)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Xóa dữ liệu cũ trong bảng 'menu_items'
        DB::table('menu_items')->truncate();

        // Lấy ID của Category sau khi CategoryTableSeeder đã chạy (Dùng Model)
        $categoryIds = [
            // !!! ĐÃ SỬA: Dùng 'category_id' thay vì 'id'
            'Món Chính'      => Category::where('category_name', 'Món Chính')->value('category_id'),
            'Đồ Ăn Nhanh'    => Category::where('category_name', 'Đồ Ăn Nhanh')->value('category_id'),
            'Đồ Uống'        => Category::where('category_name', 'Đồ Uống')->value('category_id'),
            'Tráng Miệng'    => Category::where('category_name', 'Tráng Miệng')->value('category_id'),
        ];
        
        $now = Carbon::now();

        if (in_array(null, $categoryIds, true)) {
            // Đây là cách báo lỗi an toàn hơn trong Seeder
            $this->command->error("\n\nLỖI: Không tìm thấy một hoặc nhiều Category trong DB. Vui lòng đảm bảo CategoryTableSeeder chạy thành công trước Menu_ItemsSeeder.\n\n");
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            // Không nên return nếu muốn các Seeder khác vẫn chạy
        } else {
            // Cấu trúc Seeding cho các cột: 
            // category_id, menu_item_name, description, price, image_url, status, created_at, updated_at
            $dishes = [
                [
                    'category_id' => $categoryIds['Món Chính'], 
                    'menu_item_name' => 'Phở Bò Tái Nạm',
                    'description' => 'Phở truyền thống với thịt bò tái và nạm, nước dùng hầm xương 12 giờ.',
                    'price' => 70000,
                    'image_url' => 'https://placehold.co/100x100/38bdf8/ffffff?text=PHO', 
                    'status' => 'status_available', 
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'category_id' => $categoryIds['Đồ Ăn Nhanh'], 
                    'menu_item_name' => 'Pizza Hải Sản (Size M)',
                    'description' => 'Pizza đế mỏng giòn, phủ sốt cà chua, phô mai Mozzarella và hải sản tươi.',
                    'price' => 185000,
                    'image_url' => 'https://placehold.co/100x100/fbbf24/000000?text=PIZZA',
                    'status' => 'status_available',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'category_id' => $categoryIds['Đồ Uống'], 
                    'menu_item_name' => 'Cà Phê Muối',
                    'description' => 'Cà phê phin truyền thống kết hợp với lớp kem muối béo ngậy, đậm vị.',
                    'price' => 45000,
                    'image_url' => 'https://placehold.co/100x100/10b981/ffffff?text=CF',
                    'status' => 'status_unavailable', 
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'category_id' => $categoryIds['Món Chính'], 
                    'menu_item_name' => 'Cơm Gà Xối Mỡ',
                    'description' => 'Đùi gà xối mỡ da giòn tan, ăn kèm cơm dẻo và nước chấm đặc biệt.',
                    'price' => 60000,
                    'image_url' => 'https://placehold.co/100x100/f87171/ffffff?text=COM',
                    'status' => 'status_available',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'category_id' => $categoryIds['Tráng Miệng'], 
                    'menu_item_name' => 'Chè Dưỡng Nhan',
                    'description' => 'Thanh mát, bổ dưỡng với tuyết yến, nhựa đào, hạt chia và táo đỏ.',
                    'price' => 40000,
                    'image_url' => 'https://placehold.co/100x100/ec4899/ffffff?text=CHE',
                    'status' => 'status_available',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ];
            // Chèn dữ liệu vào bảng 'menu_items'
            DB::table('menu_items')->insert($dishes);
        }

        // 2. Bật lại kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
