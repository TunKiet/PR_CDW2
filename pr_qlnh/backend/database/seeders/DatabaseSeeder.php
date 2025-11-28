<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            // 1️⃣ Dữ liệu gốc - người dùng, nhóm quyền
            UserSeeder::class,

            // 2️⃣ Danh mục và thực đơn
            CategorySeeder::class,
            MenuItemSeeder::class,

            // 3️⃣ Khách hàng và bàn ăn
            CustomerSeeder::class,
            TableSeeder::class,

            // 4️⃣ Đặt bàn (phụ thuộc customer, table, user)
            ReservationSeeder::class,

            // 5️⃣ Đơn hàng & chi tiết đơn hàng
            OrderSeeder::class,
            OrderDetailSeeder::class,

            // 6️⃣ Thanh toán (phụ thuộc orders)
            PaymentSeeder::class,

            // 7️⃣ Điểm thưởng (phụ thuộc customers)
            PointSeeder::class,

            // 8️⃣ Các phần phụ (review, công thức, tin nhắn, v.v.)
            ConversationSeeder::class,
            MessageSeeder::class,
            CookingRecipeSeeder::class,
            ReviewSeeder::class,
            ReviewReplySeeder::class,

            // 9️⃣ Phiếu nhập hàng
            PurchaseOrderSeeder::class,
            PurchaseOrderItemSeeder::class,

            // 🔟 Phiên làm việc, dữ liệu tạm
            SessionSeeder::class,
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
