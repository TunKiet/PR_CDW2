<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    const MAX_RECORDS = 40; // số lượng review muốn tạo

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sampleComments = [
            'Món ăn rất ngon, nhân viên phục vụ thân thiện.',
            'Chưa hài lòng về độ nóng của món.',
            'Rất tuyệt vời, sẽ quay lại!',
            'Chất lượng món ăn tạm ổn.',
            'Phục vụ nhanh, món ăn ngon.'
        ];

        $sampleImages = [
            'review1.jpg',
            'review2.jpg',
            'review3.jpg',
            null,
            null
        ];

        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            $userId = rand(1, 10);        // giả sử user_id từ 1 đến 10
            $menuItemId = rand(1, 6);    // giả sử menu_item_id từ 1 đến 20

            $rating = rand(1, 5);
            $comment = $sampleComments[array_rand($sampleComments)];
            $imageUrl = $sampleImages[array_rand($sampleImages)];
            $like = rand(0, 50);
            $dislike = rand(0, 10);

            DB::table('reviews')->insert([
                'user_id' => $userId,
                'menu_item_id' => $menuItemId,
                'rating' => $rating,
                'comment' => $comment,
                'image_url' => $imageUrl,
                'like' => $like,
                'dislike' => $dislike,
                'status' => 'appored',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
