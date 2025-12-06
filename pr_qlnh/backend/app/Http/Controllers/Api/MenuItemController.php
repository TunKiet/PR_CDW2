<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem; // ⚠️ Quan trọng: import đúng model

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category')->orderBy('created_at', 'desc');

        // Filter theo category_id nếu có
        if ($request->has('category_id') && $request->category_id != 'all') {
            $query->where('category_id', $request->category_id);
        }

        // Pagination backend
        $items = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'current_page' => $items->currentPage(),
            'last_page' => $items->lastPage(),
            'total' => $items->total()
        ]);
    }

    public function show($id)
    {
        $item = MenuItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Menu item not found'], 404);
        }

        return response()->json($item);
    }

}