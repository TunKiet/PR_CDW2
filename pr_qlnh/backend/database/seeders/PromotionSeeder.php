<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Vô hiệu hóa Khóa ngoại để lệnh TRUNCATE không bị lỗi
        Schema::disableForeignKeyConstraints();
        DB::table('promotions')->truncate();
        Schema::enableForeignKeyConstraints();

        $promotions = [
            [
                'code' => 'VALENTINE2026',
                'title' => 'Ưu đãi Lễ Tình Nhân 14/2',
                'description' => 'Giảm 30% cho cặp đôi khi đặt bàn trước 1 ngày.',
                
                // ĐÃ SỬA: discount_type = 'percent'
                'discount_type' => 'percent', 
                'discount_value' => 30.00, // 30%

                'max_uses' => 100, 
                'used_count' => 0, 

                // ĐÃ XÓA 'start_date' VÀ SỬ DỤNG 'expired_at'
                'expired_at' => '2026-02-14 23:59:59', 
                
                'status' => 'active', 

                // ĐÃ XÓA 'image_url'
            ],
            [
                'code' => 'VIP15OFF',
                'title' => 'Giảm 15% cho thành viên VIP',
                'description' => 'Áp dụng cho mọi hóa đơn trên 500,000đ.',

                'discount_type' => 'percent',
                'discount_value' => 15.00,
                
                'max_uses' => null, // Không giới hạn
                'used_count' => 10,

                'expired_at' => '2026-12-31 23:59:59',
                
                'status' => 'active', 
            ],
            [
                'code' => 'HAPPYHOUR',
                'title' => 'Happy Hour: Giảm 50.000đ Món Chủ Đạo',
                'description' => 'Áp dụng giảm trực tiếp 50.000đ cho các món chính.',

                // ĐÃ SỬA: discount_type = 'fixed'
                'discount_type' => 'fixed',
                'discount_value' => 50000.00, // Giảm 50,000 VNĐ

                'max_uses' => 500,
                'used_count' => 0,

                'expired_at' => '2025-12-31 17:00:00',
                
                'status' => 'active', 
            ],
            [
                'code' => 'NEWYEAR2026',
                'title' => 'Chào mừng năm mới 2026',
                'description' => 'Ưu đãi đã hết hạn. Dùng để kiểm tra trạng thái.',

                'discount_type' => 'percent',
                'discount_value' => 10.00,

                'max_uses' => 1000,
                'used_count' => 1000, // Đã dùng hết

                'expired_at' => '2025-01-01 23:59:59', // Đã hết hạn
                
                'status' => 'inactive', // Đặt trạng thái không hoạt động
            ],
        ];

        DB::table('promotions')->insert($promotions);
    }
}