<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;
use Illuminate\Validation\Rule;

class PromotionController extends Controller
{
    /**
     * Lấy danh sách tất cả các khuyến mãi (dùng cho Admin).
     * GET /api/admin/promotions
     */
    public function index()
    {
        // Trả về trực tiếp mảng JSON
        $promos = Promotion::orderBy('promotion_id', 'desc')->get();
        return response()->json($promos);
    }

    /**
     * Lấy chi tiết một khuyến mãi.
     * GET /api/admin/promotions/{id}
     */
    public function show(string $id)
    {
        // Sử dụng Route Model Binding nếu route được khai báo chuẩn (Promotion $promotion)
        // Nếu không, FindOrFail là cách đúng đắn.
        $promo = Promotion::findOrFail($id);
        return response()->json($promo);
    }

    /**
     * Tạo khuyến mãi mới.
     * POST /api/admin/promotions
     */
    public function store(Request $req)
    {
        $validated = $req->validate([
            'code' => 'required|string|max:50|unique:promotions,code',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'discount_type' => ['required', Rule::in(['percent', 'fixed'])],
            'discount_value' => 'required|numeric|min:0',
            'expired_at' => 'nullable|date',
            // Theo migration, max_uses là unsignedInteger. Dùng min:0 là ổn.
            'max_uses' => 'nullable|integer|min:0',
            'status' => ['nullable', 'string', 'max:30'] // Mặc định là 'active'
        ]);

        // Sử dụng $validated để đảm bảo chỉ các trường đã validate được sử dụng
        $promo = Promotion::create($validated);

        return response()->json($promo, 201);
    }

    /**
     * Cập nhật khuyến mãi.
     * PUT/PATCH /api/admin/promotions/{id}
     */
    public function update(Request $req, string $id)
    {
        $promo = Promotion::findOrFail($id);
        // ✅ TC-002: KIỂM TRA TỒN TẠI
        if (!$promo) {
            return response()->json([
                'success' => false,
                'message' => 'Ưu đãi không tồn tại (có thể đã bị xóa)!'
            ], 404);
        }

        // ✅ TC-001: KIỂM TRA CONFLICT
    $clientUpdatedAt = $req->input('updated_at');
    
    if ($clientUpdatedAt) {
        $dbTimestamp = $promo->updated_at->format('Y-m-d H:i:s');
        $clientTimestamp = date('Y-m-d H:i:s', strtotime($clientUpdatedAt));
        
        if ($clientTimestamp !== $dbTimestamp) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu đã bị thay đổi bởi người dùng khác. Vui lòng tải lại trang!',
                'error_code' => 'DATA_CONFLICT',
                'current_data' => $promo,
            ], 409);
        }
    }

        $validated = $req->validate([
            // 'sometimes' chỉ kiểm tra nếu trường này có mặt trong request
            // Đảm bảo code là duy nhất, nhưng bỏ qua chính promotion đang cập nhật
            'code' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('promotions', 'code')->ignore($promo->promotion_id, 'promotion_id')],
            'title' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'discount_type' => ['sometimes', 'required', Rule::in(['percent', 'fixed'])],
            'discount_value' => 'sometimes|required|numeric|min:0',
            'expired_at' => 'nullable|date',
            'max_uses' => 'nullable|integer|min:0',
            'status' => ['sometimes', 'required', 'string', 'max:30']
        ]);
        unset($validated['updated_at']);
        $promo->update($validated);

        // Trả về đối tượng đã cập nhật
        return response()->json([
        'success' => true,
        'message' => 'Cập nhật ưu đãi thành công!',
        'data' => $promo->fresh()
    ]);
    }

    /**
     * Xóa khuyến mãi.
     * DELETE /api/admin/promotions/{id}
     */
    public function destroy(string $id)
    {
        Promotion::findOrFail($id)->delete();
        // Trả về 204 No Content là chuẩn RESTful hơn.
        return response()->json(null, 204);
    }

    /**
     * API công khai: Kiểm tra tính hợp lệ của mã khuyến mãi.
     * POST /api/promotions/validate
     */
    public function validateCode(Request $req)
    {
        $req->validate(['code' => 'required|string|max:50']);

        $promo = Promotion::where('code', $req->code)
            ->where('status', 'active')
            // Điều kiện chưa hết hạn: (expired_at IS NULL) OR (expired_at > NOW())
            ->where(function ($q) {
                $q->whereNull('expired_at')->orWhere('expired_at', '>', now());
            })
            // Điều kiện còn lượt sử dụng: (max_uses IS NULL) OR (used_count < max_uses)
            ->where(function ($q) {
                $q->whereNull('max_uses')->orWhereColumn('used_count', '<', 'max_uses');
            })
            ->first();

        // Kiểm tra sau khi truy vấn để tránh trả về 404 cho trường hợp mã không tồn tại 
        // và mã tồn tại nhưng đã hết hạn/hết lượt dùng.
        if (!$promo) {
            // Trả về 400 Bad Request hoặc 404 Not Found tùy theo quy ước. Dùng 400 rõ ràng hơn cho lỗi logic người dùng.
            return response()->json([
                'valid' => false,
                'message' => 'Mã không hợp lệ, đã hết hạn, hoặc đã hết lượt sử dụng.'
            ], 400);
        }

        // Trả về đối tượng khuyến mãi để client có thể tính toán giảm giá
        return response()->json([
            'valid' => true,
            'promotion' => $promo
        ]);
    }

    public function getActive()
    {
        $promotions = Promotion::where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->where(function ($query) {
                $query->where('max_uses', 0)
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