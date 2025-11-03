<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewReplySeeder extends Seeder
{
    const MAX_REPLIES = 50; // số lượng phản hồi muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sampleReplies = [
            'Cảm ơn bạn đã đánh giá!',
            'Chúng tôi sẽ cải thiện chất lượng món ăn.',
            'Rất vui vì bạn hài lòng.',
            'Xin lỗi vì trải nghiệm chưa tốt.',
            'Cảm ơn góp ý của bạn, chúng tôi sẽ lưu ý.'
        ];

        for ($i = 1; $i <= self::MAX_REPLIES; $i++) {
            // Random review_id giả sử từ 1 đến 40 (tương ứng ReviewSeeder)
            $reviewId = rand(1, 40);

            // Random user_id giả sử từ 1 đến 10
            $userId = rand(1, 10);

            $replyText = $sampleReplies[array_rand($sampleReplies)];

            DB::table('review_replies')->insert([
                'review_id' => $reviewId,
                'user_id' => $userId,
                'reply_text' => $replyText,
                'status' => 'approved',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
