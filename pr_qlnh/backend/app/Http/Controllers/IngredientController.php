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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ingredient_name' => 'required|string|max:255',
            'category_ingredient_id' => 'required|integer|exists:category_ingredients,category_ingredient_id',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
        ]);
        $validated['total_price'] = $validated['price'] * $validated['stock_quantity'];
        $ingredient = Ingredient::create($validated);
        return response()->json([
            'message' => 'Thêm nguyên liệu thành công!',
            'data' => $ingredient
        ], 201);
    }

    public function destroy($id)
    {
        $ingredient = Ingredient::remove($id);

        if (!$ingredient['success']) {
            return response()->json([
                'success' => false,
                'message' => $ingredient['message']
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => $ingredient['message'],
            'data' => $ingredient['data']
        ]);
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

        $result = Ingredient::updateIngredient($id, $validated);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['data']
        ]);
    }
}
