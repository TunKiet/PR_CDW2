<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IngredientController extends Controller
{
    /**
     * Summary of getAllIngredient
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllIngredient()
    {
        $ingredients = Ingredient::allIngedient();

        return response()->json($ingredients);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'ingredient_name' => 'required|string|max:255',
            'category_ingredient_id' => 'required|integer|exists:category_ingredients,category_ingredient_id',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
        ]);

        $ingredient = Ingredient::updateIngredient($id, $validated);


        if (!$ingredient) {
            return response()->json(['message' => 'Không tìm thấy nguyên liệu'], 404);
        }

        return response()->json([
            'message' => 'Cập nhật nguyên liệu thành công',
            'data' => $ingredient
        ]);
    }
}
