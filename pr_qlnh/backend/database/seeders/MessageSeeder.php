<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageSeeder extends Seeder
{
    const MAX_RECORDS = 30; // số lượng bản ghi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $senderTypes = ['user', 'admin'];
        $sampleMessages = [
            'Xin chào, tôi muốn đặt bàn.',
            'Tôi muốn hủy đơn hàng.',
            'Sản phẩm đã nhận được chưa?',
            'Cảm ơn bạn đã hỗ trợ!',
            'Có ưu đãi gì hôm nay không?',
            'Tôi muốn thay đổi thông tin đơn hàng.'
        ];

        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            // Random user_id giả sử từ 1 đến 10
            $userId = rand(1, 10);

            // Chọn loại người gửi ngẫu nhiên
            $senderType = $senderTypes[array_rand($senderTypes)];

            // Chọn nội dung tin nhắn ngẫu nhiên
            $messageText = $sampleMessages[array_rand($sampleMessages)];

            DB::table('messages')->insert([
                'user_id' => $userId,
                'sender_type' => $senderType,
                'message' => $messageText,
                'status' => 'sent',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
