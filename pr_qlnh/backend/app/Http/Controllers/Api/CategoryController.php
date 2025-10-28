<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    // Lấy toàn bộ danh mục
    public function index()
    {
        $categories = Category::select('category_id', 'category_name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}
