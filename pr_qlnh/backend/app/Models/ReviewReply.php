<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewReply extends Model
{
    protected $table = 'review_replies';
    protected $primaryKey = 'reply_id';
    public $timestamps = true;

    protected $fillable = [
        'review_id',
        'user_id',
        'reply_text',
        'status'
    ];

    public function review()
    {
        return $this->belongsTo(Review::class, 'review_id', 'review_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // ✅ Hàm static lấy danh sách phản hồi theo review_id
    public static function getRepliesByReviewId($reviewId)
    {
        return self::with([
            'user:user_id,username,role',
            'review.user:user_id,username,role'
        ])
            ->where('review_id', $reviewId)
            ->orderByDesc('created_at')
            ->get();
    }

    // App\Models\ReviewReply.php
    public static function getRepliesByMenuItem($menuItemId)
    {
        return self::with([
            'user:user_id,username,role',
            'review:user_id,menu_item_id'
        ])
            ->whereHas('review', function ($query) use ($menuItemId) {
                $query->where('menu_item_id', $menuItemId);
            })
            ->orderByDesc('created_at')
            ->get();
    }
}
