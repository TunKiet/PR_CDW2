<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PromotionController extends Controller
{
    /**
     * Display a listing of promotions
     */
    public function index(Request $request): JsonResponse
    {
        $query = Promotion::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by discount type
        if ($request->has('discount_type')) {
            $query->where('discount_type', $request->discount_type);
        }

        // Search by code or title
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $promotions = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $promotions->items(),
            'pagination' => [
                'total' => $promotions->total(),
                'per_page' => $promotions->perPage(),
                'current_page' => $promotions->currentPage(),
                'last_page' => $promotions->lastPage(),
                'from' => $promotions->firstItem(),
                'to' => $promotions->lastItem()
            ]
        ], 200);
    }

    /**
     * Store a newly created promotion
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:promotions,code',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expired_at' => 'nullable|date|after:now',
            'status' => 'nullable|string|max:30'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate discount_value based on discount_type
        if ($request->discount_type === 'percent' && $request->discount_value > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Discount value cannot exceed 100% for percent type'
            ], 422);
        }

        $promotion = Promotion::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Promotion created successfully',
            'data' => $promotion
        ], 201);
    }

    /**
     * Display the specified promotion
     */
    public function show(string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $promotion
        ], 200);
    }

    /**
     * Update the specified promotion
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|required|string|max:50|unique:promotions,code,' . $id . ',promotion_id',
            'title' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'discount_type' => 'sometimes|required|in:percent,fixed',
            'discount_value' => 'sometimes|required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expired_at' => 'nullable|date',
            'status' => 'nullable|string|max:30'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate discount_value based on discount_type
        if ($request->has('discount_type') && $request->discount_type === 'percent' && $request->discount_value > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Discount value cannot exceed 100% for percent type'
            ], 422);
        }

        $promotion->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Promotion updated successfully',
            'data' => $promotion
        ], 200);
    }

    /**
     * Remove the specified promotion
     */
    public function destroy(string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion not found'
            ], 404);
        }

        // Check if promotion is being used
        if ($promotion->used_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete promotion that has been used'
            ], 400);
        }

        $promotion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Promotion deleted successfully'
        ], 200);
    }

    /**
     * Verify promotion code
     */
    public function verifyCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Code is required',
                'errors' => $validator->errors()
            ], 422);
        }

        $promotion = Promotion::where('code', $request->code)
            ->where('status', 'active')
            ->first();

        if (!$promotion) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or inactive promotion code'
            ], 404);
        }

        // Check if expired
        if ($promotion->expired_at && now()->isAfter($promotion->expired_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion code has expired'
            ], 400);
        }

        // Check max uses
        if ($promotion->max_uses && $promotion->used_count >= $promotion->max_uses) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion code has reached maximum uses'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Promotion code is valid',
            'data' => $promotion
        ], 200);
    }

    /**
     * Apply promotion (increment used_count)
     */
    public function apply(string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion not found'
            ], 404);
        }

        $promotion->increment('used_count');

        return response()->json([
            'success' => true,
            'message' => 'Promotion applied successfully',
            'data' => $promotion
        ], 200);
    }
}