<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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
    public function replies()
    {
        return $this->hasMany(ReviewReply::class, 'review_id', 'review_id')
            ->where('status', 'approved')
            ->with('user')
            ->orderBy('created_at', 'asc');
    }


    //Input menuItemId, limit = 5 review
    //Get review with user, cache Redis
    public static function getReviewByMenuItemId($menuItemId, $limit = 5)
    {
        return Cache::remember("reviews:$menuItemId", 60, function () use ($menuItemId, $limit) {
            return self::with(['user', 'replies'])
                ->where('menu_item_id', $menuItemId)
                ->orderBy('created_at', 'desc')
                ->take($limit)
                ->get();
        });
    }

    //Total review, Input menuItemId
    public static function totalReviewOfOneMenuItem($menuItemId)
    {
        return self::where('menu_item_id', $menuItemId)->count();
    }

    //Average review, Input menuItemId
    public static function averageRating($menuItemId)
    {
        return self::where('menu_item_id', $menuItemId)->avg('rating');
    }

    //Total review of every rating, Input menuItemId
    public static function ratingCounts($menuItemId)
    {
        return self::where('menu_item_id', $menuItemId)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');
    }

}
