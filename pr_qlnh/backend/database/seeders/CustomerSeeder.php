<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder {
    public function run(): void {
        DB::table('customers')->truncate();

        DB::table('customers')->insert([
            ['name' => 'Nguyễn Văn An', 'phone' => '0901234567', 'points' => 120],
            ['name' => 'Trần Thị Bình', 'phone' => '0902345678', 'points' => 80],
            ['name' => 'Lê Văn Cường', 'phone' => '0903456789', 'points' => 0],
            ['name' => 'Phạm Thị Dung', 'phone' => '0904567890', 'points' => 30],
        ]);
    }
}
