<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    const MAX_RECORDS = 10; // số lượng bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('categories')->insert([
                'category_name' => 'Category ' . $i,
                'description' => 'Description for category ' . $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
