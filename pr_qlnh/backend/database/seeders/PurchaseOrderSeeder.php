<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PurchaseOrderSeeder extends Seeder
{
    const MAX_RECORDS = 15; // số đơn hàng mua muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            'Công ty ABC',
            'Nhà cung cấp XYZ',
            'Công ty Thực phẩm 123',
            'Công ty FreshFarm',
            'Nhà cung cấp GreenFood'
        ];

        $statuses = ['ordered', 'received', 'cancelled'];

        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            $supplierName = $suppliers[array_rand($suppliers)];

            // Tổng chi phí random từ 1.000.000 -> 50.000.000
            $totalCost = rand(1000, 50000) * 1000;

            // Trạng thái random
            $status = $statuses[array_rand($statuses)];

            DB::table('purchase_orders')->insert([
                'supplier_name' => $supplierName,
                'total_cost' => $totalCost,
                'status' => $status,
                'order_date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
