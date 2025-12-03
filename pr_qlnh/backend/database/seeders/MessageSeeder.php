<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageSeeder extends Seeder
{
    const MAX_RECORDS = 50; // số lượng message muốn tạo

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

        // Lấy tất cả conversation có sẵn
        $conversations = DB::table('conversations')->pluck('conversation_id')->toArray();

        if (empty($conversations)) {
            $this->command->info('No conversations found. Please seed conversations first.');
            return;
        }

        foreach (range(1, self::MAX_RECORDS) as $i) {
            // Chọn conversation ngẫu nhiên
            $conversationId = $conversations[array_rand($conversations)];

            // Lấy admin_id và customer_id của conversation
            $conversation = DB::table('conversations')->where('conversation_id', $conversationId)->first();

            // Chọn sender ngẫu nhiên giữa admin và customer
            $senderType = $senderTypes[array_rand($senderTypes)];
            $userId = $senderType === 'admin' ? $conversation->admin_id : $conversation->customer_id;

            // Chọn message ngẫu nhiên
            $messageText = $sampleMessages[array_rand($sampleMessages)];

            // Tạo message
            $messageId = DB::table('messages')->insertGetId([
                'conversation_id' => $conversationId,
                'user_id' => $userId,
                'sender_type' => $senderType,
                'message' => $messageText,
                'status' => 'sent',
                'is_read' => $senderType === 'admin' ? true : false, // ví dụ admin đọc luôn
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Cập nhật last_message_id của conversation
            DB::table('conversations')
                ->where('conversation_id', $conversationId)
                ->update(['last_message_id' => $messageId, 'updated_at' => now()]);
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
