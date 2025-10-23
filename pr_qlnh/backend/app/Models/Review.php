<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'review_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'menu_item_id',
        'rating',
        'comment',
        'image_url',
        'like',
        'dislike',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function menu_item()
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id', 'menu_item_id');
    }
    /**
     * Summary of getAllReviews
     * @param mixed $menuItemId
     * @return \Illuminate\Database\Eloquent\Collection<int, Review>
     */
    public static function getAllReviews($menuItemId)
    {
        return self::with(['user:user_id,username', 'menu_item:menu_item_id,menu_item_name'])
            ->where('menu_item_id', $menuItemId)
            ->get();
    }

    /**
     * Summary of getAverageRating
     * @param mixed $menuItemId
     * @return array{average: float, breakdown: array, count: float|int}
     */
    public static function getAverageRating($menuItemId): array
    {
        $ratingGroups = self::selectRaw('rating, COUNT(*) as total')
            ->where('menu_item_id', $menuItemId)
            ->groupBy('rating')
            ->pluck('total', 'rating')
            ->toArray();

        // Trung bình và tổng số lượt đánh giá
        $average = self::where('menu_item_id', $menuItemId)->avg('rating');
        $count = array_sum($ratingGroups);

        // Đảm bảo có đủ key từ 1 → 5
        $breakdown = [];
        for ($i = 1; $i <= 5; $i++) {
            $breakdown[$i] = $ratingGroups[$i] ?? 0;
        }

        return [
            'average'   => round($average ?? 0, 1),
            'count'     => $count,
            'breakdown' => $breakdown,
        ];
    }
}
