<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function getDataReview($menuItemId)
    {
        $reviews = Review::getReviewByMenuItemId($menuItemId, 5);

        $totalReviews = Review::totalReviewOfOneMenuItem($menuItemId);

        $avgRating = Review::averageRating($menuItemId);

        $ratingCounts = Review::ratingCounts($menuItemId);

        return response()->json([
            'reviews' => $reviews,
            'total' => $totalReviews,
            'average' => round($avgRating, 1),
            'rating_counts' => $ratingCounts
        ]);
    }

    //Request send review
    public function store(Request $request)
    {
        $request->validate([
            'menu_item_id' => 'required|integer',
            'user_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            'image_url' => 'nullable|string',
        ]);

        $review = Review::create($request->all());

        return response()->json([
            'data' => $review,
        ]);
    }

    //Request button like, dislike
    // public function toggleLike($reviewId, Request $request)
    // {
    //     $review = Review::findOrFail($reviewId);
    //     $type = $request->type;

    //     if ($type === 'like') {
    //         $review->like = $review->like == 0 ? 1 : 0;
    //     } else {
    //         $review->dislike = $review->dislike == 0 ? 1 : 0;
    //     }

    //     $review->save();

    //     return response()->json($review);
    // }
    

    public function getAllReviews()
    {
        $review = Review::getReview();

        return response()->json([
            'data' => $review
        ]);
    }

    public function getDataChartReview()
    {
        $countReview = Review::countAllReview();

        $averageReview = Review::averageRatingAllReview();

        $quantityReviewRating = Review::quantityOfRating();

        $reviewOfDay = Review::quantityReviewOfWeekday();

        $percentYear = Review::reviewPercentByMonth();

        return response()->json([
            'count_review' => $countReview,
            'average_review' => $averageReview,
            'quantity_review_rating' => $quantityReviewRating,
            'review_of_day' => $reviewOfDay,
            'percent_year' => $percentYear
        ]);
    }
}
