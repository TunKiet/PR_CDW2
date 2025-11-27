<?php
// database/seeders/CustomerSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('customers')->truncate();
        Schema::enableForeignKeyConstraints();

        $customers = [
            ['phone' => '0901234567', 'name' => 'Nguyễn Văn A', 'points' => 150],
            ['phone' => '0902345678', 'name' => 'Trần Thị B', 'points' => 230],
            ['phone' => '0903456789', 'name' => 'Lê Văn C', 'points' => 80],
            ['phone' => '0904567890', 'name' => 'Phạm Thị D', 'points' => 320],
            ['phone' => '0905678901', 'name' => 'Hoàng Văn E', 'points' => 95],
            ['phone' => '0906789012', 'name' => 'Võ Thị F', 'points' => 180],
            ['phone' => '0907890123', 'name' => 'Đặng Văn G', 'points' => 450],
            ['phone' => '0908901234', 'name' => 'Bùi Thị H', 'points' => 120],
            ['phone' => '0909012345', 'name' => 'Dương Văn I', 'points' => 270],
            ['phone' => '0900123456', 'name' => 'Trương Thị K', 'points' => 190],
        ];

        DB::table('customers')->insert($customers);
        
        echo "✅ Đã tạo " . count($customers) . " khách hàng.\n";
    }
}