<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class CategoryIngredientController extends Controller
{
    public function index()
    {
        $categories = Ingredient::all(); // chỉ lấy danh mục

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    // Lấy danh mục kèm nguyên liệu
    public function indexWithIngredients()
    {
        $categories = Ingredient::with('ingredient')->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}
