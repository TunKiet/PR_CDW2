<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,menu_item_id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'image_url' => 'nullable|image|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('image_url')) {
            $path = $request->file('image_url')->store('reviews', 'public');
        }


        $review = Review::create([
            'user_id' => 1,
            'menu_item_id' => 1,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'image_url' => $path,
        ]);

        $reviewWithUser = Review::with('user:user_id,username')->find($review->review_id);

        return response()->json([
            'message' => 'Đánh giá đã được lưu thành công!',
            'data' => $reviewWithUser
        ]);
    }
    
    /**
     * Summary of getAllReviews
     * @param mixed $menuItemId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllReviews($menuItemId)
    {
        $reviewAll = Review::getAllReviews($menuItemId);
        return response()->json($reviewAll);
    }

    /**
     * Summary of getAllReviews
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThreeReview($menuItemId)
    {
        $reviews = Review::getLatestThreeReview($menuItemId);
        return response()->json($reviews, 200);
    }

    //get average rating
    public function getRatingStats($menuItemId)
    {
        $data = Review::getAverageRating($menuItemId);

        return response()->json([
            'status' => 'pending',
            'message' => 'Lấy dữ liệu đánh giá thành công',
            'data' => $data,
        ]);
    }
}
