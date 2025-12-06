<?php
// database/seeders/OrderSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\MenuItem;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Kiểm tra món ăn
        $menuItemIds = MenuItem::pluck('menu_item_id')->toArray();
        if (empty($menuItemIds)) {
            echo "❌ LỖI: Bảng menu_items trống!\n";
            return;
        }

        // Kiểm tra khách hàng
        $customerIds = Customer::pluck('customer_id')->toArray();
        if (empty($customerIds)) {
            echo "❌ LỖI: Bảng customers trống!\n";
            return;
        }

        echo "✅ Tìm thấy " . count($menuItemIds) . " món ăn\n";
        echo "✅ Tìm thấy " . count($customerIds) . " khách hàng\n";

        // Tắt foreign key check
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        OrderDetail::truncate();
        Order::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        echo "\n📊 Bắt đầu tạo dữ liệu orders theo các khoảng thời gian...\n\n";

        // === PHÂN BỔ ORDERS THEO KHOẢNG THỜI GIAN ===
        
        $timeRanges = [
            // [Từ ngày nào, Đến ngày nào, Số orders, Mô tả]
            [365, 181, 20, '📅 6-12 tháng trước'],  // 20 orders
            [180, 91, 30, '📅 3-6 tháng trước'],    // 30 orders
            [90, 31, 50, '📅 1-3 tháng trước'],     // 50 orders
            [30, 8, 80, '📅 1 tuần - 1 tháng'],     // 80 orders
            [7, 0, 100, '📅 7 ngày gần nhất'],      // 100 orders (nhiều nhất)
        ];

        $totalOrders = 0;

        foreach ($timeRanges as [$fromDays, $toDays, $numOrders, $description]) {
            echo "{$description}: Tạo {$numOrders} orders...\n";

            for ($i = 1; $i <= $numOrders; $i++) {
                // Random ngày trong khoảng
                $daysAgo = rand($toDays, $fromDays);
                $createdAt = Carbon::now()
                    ->subDays($daysAgo)
                    ->setHour(rand(8, 22))
                    ->setMinute(rand(0, 59))
                    ->setSecond(0);

                // Tạo order
                $order = Order::create([
                    'customer_id' => $customerIds[array_rand($customerIds)],
                    'total_price' => 0,
                    'note' => $i % 5 == 0 ? 'Ghi chú đơn hàng số ' . ($totalOrders + $i) : null,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                // Tạo 2-5 order details
                $numItems = rand(2, 5);
                $totalPrice = 0;

                for ($j = 0; $j < $numItems; $j++) {
                    $menuItemId = $menuItemIds[array_rand($menuItemIds)];
                    $quantity = rand(1, 3);
                    
                    $menuItem = MenuItem::find($menuItemId);
                    $price = $menuItem ? $menuItem->price : 50000;

                    OrderDetail::create([
                        'order_id' => $order->order_id,
                        'menu_item_id' => $menuItemId,
                        'quantity' => $quantity,
                        'price' => $price,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    $totalPrice += $price * $quantity;
                }

                $order->update(['total_price' => $totalPrice]);
                $totalOrders++;
            }

            echo "   ✓ Hoàn thành {$numOrders} orders\n\n";
        }

        echo "🎉 HOÀN THÀNH! Đã tạo tổng cộng {$totalOrders} orders.\n";
        echo "\n📊 THỐNG KÊ PHÂN BỔ:\n";
        echo "   • 7 ngày gần nhất: 100 orders\n";
        echo "   • 1 tuần - 1 tháng: 80 orders\n";
        echo "   • 1-3 tháng: 50 orders\n";
        echo "   • 3-6 tháng: 30 orders\n";
        echo "   • 6-12 tháng: 20 orders\n";
        echo "   • TỔNG: {$totalOrders} orders\n\n";
    }
}