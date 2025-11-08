<?php

namespace App\Http\Controllers;

use App\Models\CategoryIngredient;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class CategoryIngredientController extends Controller
{
    public function getAllCategoryIngredient()
    {
        $category = CategoryIngredient::index();

        return response()->json([
            'data' => $category
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
