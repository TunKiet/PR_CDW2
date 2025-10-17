<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
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
            'menu_item_id' => $validated['menu_item_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'image_url' => $path,
        ]);

        return response()->json([
            'message' => 'Đánh giá đã được lưu thành công!',
            'data' => $review
        ]);
    }

    public function index($menuItemId)
    {
        $reviews = Review::where('menu_item_id', $menuItemId)
            ->where('status', 'approved')
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json($reviews);
    }
}
