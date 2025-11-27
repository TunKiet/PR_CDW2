<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

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
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id', 'menu_item_id');
    }

    public static function getReview($perPage = 10)
    {
        return self::with('user:user_id,full_name', 'menuItem:menu_item_id,menu_item_name')
            ->orderBy('review_id', 'desc')
            ->paginate($perPage);
    }



    //Input menuItemId, limit = 5 review
    //Get review with user, cache Redis
    public static function getReviewByMenuItemId($menuItemId, $limit = 5)
    {
        return self::with(['user', 'replies'])
            ->where('menu_item_id', $menuItemId)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }


    //Total review, Input menuItemId
    public static function totalReviewOfOneMenuItem($menuItemId)
    {
        return self::where('menu_item_id', $menuItemId)
            ->where('status', 'approved')
            ->count();
    }

    //Average review, Input menuItemId
    public static function averageRating($menuItemId)
    {
        return self::where('menu_item_id', $menuItemId)
            ->where('status', 'approved')
            ->avg('rating');
    }

    //Total review of every rating, Input menuItemId
    public static function ratingCounts($menuItemId)
    {
        return self::where('menu_item_id', $menuItemId)
            ->where('status', 'approved')
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');
    }

    //Count all review
    public static function countAllReview()
    {
        return self::count();
    }

    //Average rating all review
    public static function averageRatingAllReview()
    {
        return round(self::avg('rating'), 1);
    }

    //Quantity review of rating
    public static function quantityOfRating()
    {
        return self::select('rating', DB::raw('COUNT(*) as total'))
            ->groupBy('rating')
            ->orderBy('rating', 'DESC')
            ->pluck('total', 'rating');
    }

    //Get quantity review of weekday
    public static function quantityReviewOfWeekday()
    {
        return self::select(
            DB::raw('DAYOFWEEK(created_at) as weekday'),
            DB::raw('COUNT(*) as total')
        )
            ->groupBy('weekday')
            ->orderBy('weekday')
            ->pluck('total', 'weekday');
    }

    //Get count monthly review
    public static function countReviewByMonth()
    {
        return self::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');
    }

    //Percent monthly review
    public static function reviewPercentByMonth()
    {
        $count = self::countReviewByMonth(); //total monthly review

        $totalReviewYear = $count->sum(); //total yearly review

        $percent = []; //save percent monthly

        foreach (range(1, 12) as $month) {
            $monthTotal = $count[$month] ?? 0;

            if ($totalReviewYear > 0) {
                $percent[$month] = round(($monthTotal / $totalReviewYear) * 100, 2);
            } else {
                $percent[$month] = 0;
            }
        }

        return $percent;
    }

    //Delete review
    public static function deleteReview($reviewId)
    {
        $review = self::find($reviewId);
        if (!$review) {
            return false;
        }
        return $review->delete();
    }

    //Hide review
    public static function hideReview($reviewId)
    {
        $review = self::find($reviewId);

        if (!$review) {
            return false;
        }

        $review->status = 'hide';

        return $review->save();
    }

    //Approved review
    public static function approvedReview($reviewId)
    {
        $review = self::find($reviewId);

        if (!$review) {
            return false;
        }
        $review->status = 'approved';

        return $review->save();
    }
}
