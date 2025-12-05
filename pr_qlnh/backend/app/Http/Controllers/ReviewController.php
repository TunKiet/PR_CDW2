<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function getDataReview($menuItemId)
    {
        $reviews = Review::getReviewByMenuItemId($menuItemId);

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

    public function getAllReviews(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $review = Review::getReview($perPage);

        return response()->json([
            'data' => $review->items(),
            'current_page' => $review->currentPage(),
            'last_page' => $review->lastPage(),
            'per_page' => $review->perPage(),
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

    //Delete review
    public function delete($reviewId)
    {
        $delete = Review::deleteReview($reviewId);

        if ($delete) {
            return response()->json([
                'data' => true,
                'message' => 'Xóa thành công'
            ]);
        }

        return response()->json([
            'data' => false,
            'message' => 'Xóa không hợp lệ'
        ], 404);
    }

    //Hide review 
    public function hide($reviewId)
    {
        $hide = Review::hideReview($reviewId);

        if ($hide) {
            return response()->json([
                'data' => true,
            ]);
        } else {
            return response()->json([
                'data' => false
            ], 404);
        }
    }

    //Approved review
    public function approved($reviewId)
    {
        $approved = Review::approvedReview($reviewId);

        if ($approved) {
            return response()->json([
                'data' => true,
            ]);
        } else {
            return response()->json([
                'data' => false
            ], 404);
        }
    }
}
