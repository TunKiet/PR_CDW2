<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str; // Có thể giữ lại nếu bạn dùng Str ở nơi khác, hoặc xóa đi

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Vô hiệu hóa Khóa ngoại để lệnh TRUNCATE không bị lỗi 1701
        Schema::disableForeignKeyConstraints();
        DB::table('menu_items')->truncate();
        Schema::enableForeignKeyConstraints();
        
        $menuItems = [
            // === 1. Món Khai Vị (Category ID: 1) ===
            [
                'category_id' => 1,
                'menu_item_name' => 'Salad Trộn Dầu Giấm',
                'price' => 45000,
                'description' => 'Rau xanh tươi sạch kết hợp cùng cà chua bi và sốt dầu giấm chua ngọt. Món khai vị nhẹ nhàng.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/007bff/ffffff?text=Salad+Khai+Vị',
                // Đã xóa trường 'slug'
            ],
            [
                'category_id' => 1,
                'menu_item_name' => 'Chả Giò Hải Sản',
                'price' => 65000,
                'description' => 'Chả giò chiên giòn rụm với nhân tôm, mực tươi ngon. Ăn kèm nước chấm chua ngọt.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/28a745/ffffff?text=Chả+Giò+HS',
                // Đã xóa trường 'slug'
            ],
            
            // === 2. Món Chính (Category ID: 2) ===
            [
                'category_id' => 2,
                'menu_item_name' => 'Bò Né Sốt Tiêu Xanh',
                'price' => 120000,
                'description' => 'Thịt bò phi lê tươi mềm, được áp chảo nhanh cùng sốt tiêu xanh cay nồng. Ăn kèm bánh mì và trứng ốp la.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/dc3545/ffffff?text=Bò+Né',
                // Đã xóa trường 'slug'
            ],
            [
                'category_id' => 2,
                'menu_item_name' => 'Cơm Chiên Dương Châu',
                'price' => 85000,
                'description' => 'Cơm chiên tơi xốp, hạt cơm vàng ươm, kết hợp tôm, xá xíu, và đậu Hà Lan.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/ffc107/000000?text=Cơm+Chiên',
                // Đã xóa trường 'slug'
            ],
            [
                'category_id' => 2,
                'menu_item_name' => 'Gà Quay Mật Ong',
                'price' => 150000,
                'description' => 'Nửa con gà tẩm ướp mật ong, quay da giòn rụm, thịt bên trong mềm ẩm. Phục vụ với xôi chiên.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/17a2b8/ffffff?text=Gà+Quay',
                // Đã xóa trường 'slug'
            ],
            [
                'category_id' => 2,
                'menu_item_name' => 'Mì Ý Sốt Kem Nấm',
                'price' => 95000,
                'description' => 'Sợi mì Ý dai ngon hòa quyện cùng sốt kem nấm béo ngậy, rắc phô mai Parmesan bào.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/6f42c1/ffffff?text=Mì+Ý',
                // Đã xóa trường 'slug'
            ],

            // === 3. Đồ Uống (Category ID: 3) ===
            [
                'category_id' => 3,
                'menu_item_name' => 'Trà Đào Cam Sả Lạnh',
                'price' => 45000,
                'description' => 'Thức uống giải khát tuyệt vời với hương đào, cam tươi và sả thơm lừng.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/fd7e14/ffffff?text=Trà+Đào',
                // Đã xóa trường 'slug'
            ],
            [
                'category_id' => 3,
                'menu_item_name' => 'Sinh Tố Bơ',
                'price' => 55000,
                'description' => 'Sinh tố bơ tươi sánh mịn, vị ngọt tự nhiên, bổ sung năng lượng.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/20c997/ffffff?text=Sinh+Tố+Bơ',
                // Đã xóa trường 'slug'
            ],

            // === 4. Món Tráng Miệng (Category ID: 4) ===
            [
                'category_id' => 4,
                'menu_item_name' => 'Bánh Flan Caramel',
                'price' => 30000,
                'description' => 'Bánh flan mềm tan, béo ngậy vị trứng và sữa, sốt caramel đắng nhẹ thơm lừng.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/6610f2/ffffff?text=Bánh+Flan',
                // Đã xóa trường 'slug'
            ],
            [
                'category_id' => 4,
                'menu_item_name' => 'Kem Vani Sốt Dâu',
                'price' => 40000,
                'description' => 'Kem vani cao cấp, ăn kèm sốt dâu tươi tự làm và hạnh nhân lát.',
                'status' => 'active',
                'image_url' => 'https://placehold.co/600x400/e83e8c/ffffff?text=Kem+Vani',
                // Đã xóa trường 'slug'
            ],
        ];

        DB::table('menu_items')->insert($menuItems);
    }
}