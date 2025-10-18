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

        return response()->json([
            'message' => 'Đánh giá đã được lưu thành công!',
            'data' => $review
        ]);
    }

    //get review
    public function index($menuItemId)
    {
        // Log để debug xem có nhận đúng tham số không
        Log::info("🟢 Fetching reviews for menu_item_id = $menuItemId");

        $reviews = Review::where('menu_item_id', $menuItemId)->get();

        Log::info("🟢 Found " . $reviews->count() . " reviews");

        return response()->json($reviews);
    }
}
