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

    //get review
    public function index($menuItemId)
    {
        Log::info("Fetching reviews for menu_item_id = $menuItemId");

        //Lấy danh sách review kèm username
        $reviews = Review::where('menu_item_id', $menuItemId)
            ->with('user:user_id,username') // chỉ lấy 2 cột cần thiết
            ->get();

        Log::info("Found " . $reviews->count() . " reviews");

        return response()->json($reviews);
    }

    //get average rating
    public function getAverageRating($menuItemId)
    {
        $averageRating = Review::where('menu_item_id', $menuItemId)
            ->where('status', 'pending')
            ->average('rating');

        // Nếu chưa có đánh giá thì trả 0
        $averageRating = round($averageRating ?? 0, 1);

        $count = Review::where('menu_item_id', $menuItemId)
            ->where('status', 'active')
            ->count();

        return response()->json([
            'average_rating' => $averageRating,
            'total_reviews' => $count
        ]);
    }
}
