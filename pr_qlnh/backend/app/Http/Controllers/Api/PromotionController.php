<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PromotionController extends Controller
{
    // ✅ DANH SÁCH GIỚI HẠN CHO TC-004
    private const VALID_DISCOUNT_TYPES = ['percent', 'fixed'];
    private const VALID_STATUSES = ['active', 'inactive'];
    
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
            $query->where(function ($q) use ($search) {
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
     * ✅ TC-004: Validation chặt chẽ
     */
    public function store(Request $request): JsonResponse
    {
        // ✅ TC-004: Validation với giới hạn cụ thể
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:promotions,code',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string|max:65535', // TEXT field limit
            'discount_type' => 'required|in:' . implode(',', self::VALID_DISCOUNT_TYPES),
            'discount_value' => 'required|numeric|min:0|max:99999999',
            'max_uses' => 'nullable|integer|min:1|max:999999',
            'expired_at' => 'nullable|date|after:now',
            'status' => 'nullable|in:' . implode(',', self::VALID_STATUSES),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ TC-004: Kiểm tra discount_value dựa trên discount_type
        if ($request->discount_type === 'percent' && $request->discount_value > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Discount value cannot exceed 100% for percent type',
                'errors' => [
                    'discount_value' => ['Giá trị giảm giá không được vượt quá 100% cho loại phần trăm.']
                ]
            ], 422);
        }

        // ✅ Set default status nếu không có
        $data = $request->all();
        if (!isset($data['status'])) {
            $data['status'] = 'active';
        }

        $promotion = Promotion::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Promotion created successfully',
            'data' => $promotion
        ], 201);
    }

    /**
     * Display the specified promotion
     * ✅ TC-002: Kiểm tra tồn tại
     */
    public function show(string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        // ✅ TC-002: Kiểm tra tồn tại
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
     * ✅ TC-001: Optimistic Locking
     * ✅ TC-002: Kiểm tra tồn tại
     * ✅ TC-004: Validation chặt chẽ
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        // ✅ TC-002: Kiểm tra tồn tại (Stale Data Check)
        if (!$promotion) {
            return response()->json([
                'success' => false,
                'message' => 'Ưu đãi không tồn tại (có thể đã bị xóa)!',
                'error_code' => 'NOT_FOUND'
            ], 404);
        }

        // ✅ TC-001: Kiểm tra Conflict (Optimistic Locking)
        $clientUpdatedAt = $request->input('updated_at');

        if ($clientUpdatedAt) {
            $dbTimestamp = $promotion->updated_at->format('Y-m-d H:i:s');
            $clientTimestamp = date('Y-m-d H:i:s', strtotime($clientUpdatedAt));

            if ($clientTimestamp !== $dbTimestamp) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu đã bị thay đổi bởi người dùng khác. Vui lòng tải lại trang!',
                    'error_code' => 'DATA_CONFLICT',
                    'current_data' => $promotion,
                    'client_timestamp' => $clientTimestamp,
                    'server_timestamp' => $dbTimestamp,
                ], 409);
            }
        }

        // ✅ TC-004: Validation chặt chẽ
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|required|string|max:50|unique:promotions,code,' . $id . ',promotion_id',
            'title' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string|max:65535',
            'discount_type' => 'sometimes|required|in:' . implode(',', self::VALID_DISCOUNT_TYPES),
            'discount_value' => 'sometimes|required|numeric|min:0|max:99999999',
            'max_uses' => 'nullable|integer|min:1|max:999999',
            'expired_at' => 'nullable|date',
            'status' => 'nullable|in:' . implode(',', self::VALID_STATUSES),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ TC-004: Kiểm tra discount_value dựa trên discount_type
        $discountType = $request->has('discount_type') ? $request->discount_type : $promotion->discount_type;
        $discountValue = $request->has('discount_value') ? $request->discount_value : $promotion->discount_value;

        if ($discountType === 'percent' && $discountValue > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Discount value cannot exceed 100% for percent type',
                'errors' => [
                    'discount_value' => ['Giá trị giảm giá không được vượt quá 100% cho loại phần trăm.']
                ]
            ], 422);
        }

        // Loại bỏ updated_at khỏi request data
        $dataToUpdate = $request->except(['updated_at']);
        
        $promotion->update($dataToUpdate);

        return response()->json([
            'success' => true,
            'message' => 'Promotion updated successfully',
            'data' => $promotion->fresh() // Trả về data mới nhất kèm updated_at mới
        ], 200);
    }

    /**
     * Remove the specified promotion
     * ✅ TC-002: Kiểm tra tồn tại
     */
    public function destroy(string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        // ✅ TC-002: Kiểm tra tồn tại
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
     * ✅ TC-002: Kiểm tra tồn tại
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

        // ✅ TC-002: Kiểm tra tồn tại
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
     * ✅ TC-002: Kiểm tra tồn tại
     */
    public function apply(string $id): JsonResponse
    {
        $promotion = Promotion::find($id);

        // ✅ TC-002: Kiểm tra tồn tại
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

    /**
     * Get active promotions
     */
    public function getActive()
    {
        $promotions = Promotion::where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->where(function ($query) {
                $query->whereNull('max_uses')
                    ->orWhere('max_uses', 0)
                    ->orWhereRaw('used_count < max_uses');
            })
            ->limit(3)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $promotions
        ]);
    }
}