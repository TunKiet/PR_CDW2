<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('menu_items')->insert([
            [
                'category_id' => 1,
                'menu_item_name' => 'Phở Bò',
                'price' => 55000,
                'image_url' => '/images/pho-bo.jpg',
                'description' => 'Phở bò truyền thống Việt Nam.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'menu_item_name' => 'Bún Chả',
                'price' => 45000,
                'image_url' => '/images/bun-cha.jpg',
                'description' => 'Bún chả Hà Nội thơm ngon.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'menu_item_name' => 'Nem Cua Bể',
                'price' => 60000,
                'image_url' => '/images/nem-cua-be.jpg',
                'description' => 'Nem cua bể giòn rụm, hải sản tươi ngon.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'menu_item_name' => 'Chả Cá Lã Vọng',
                'price' => 120000,
                'image_url' => '/images/cha-ca-la-vong.jpg',
                'description' => 'Chả cá Lã Vọng thơm lừng, ăn kèm thì là.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 3,
                'menu_item_name' => 'Gỏi Cuốn',
                'price' => 40000,
                'image_url' => '/images/goi-cuon.jpg',
                'description' => 'Gỏi cuốn tôm thịt, chấm tương đậu phộng.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'menu_item_name' => 'Cà Phê Sữa Đá',
                'price' => 25000,
                'image_url' => '/images/ca-phe-sua-da.jpg',
                'description' => 'Cà phê sữa đá đậm vị Việt Nam.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'menu_item_name' => 'Nước Dừa',
                'price' => 20000,
                'image_url' => '/images/nuoc-dua.jpg',
                'description' => 'Nước dừa tươi mát lạnh.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'menu_item_name' => 'Trà Chanh',
                'price' => 20000,
                'image_url' => '/images/tra-chanh.jpg',
                'description' => 'Trà chanh giải khát ngày hè.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
