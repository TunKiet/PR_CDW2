<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PromotionSeeder extends Seeder {
    public function run(): void {
        DB::table('promotions')->truncate();

        DB::table('promotions')->insert([
            ['code' => 'WELCOME10', 'description' => 'Giảm 10% cho đơn đầu tiên', 'discount_percent' => 10, 'active' => 1],
            ['code' => 'FREEDRINK', 'description' => 'Tặng 1 đồ uống cho đơn > 200k', 'discount_percent' => 0, 'active' => 1],
        ]);
    }
}

