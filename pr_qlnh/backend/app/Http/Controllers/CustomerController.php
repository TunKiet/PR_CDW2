<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * 🔹 Lấy danh sách toàn bộ khách hàng
     * Endpoint: GET /api/customers
     */
    public function index()
{
    try {
        $customers = Customer::orderBy('customer_id', 'desc')->get();
        return response()->json($customers, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Lỗi khi lấy danh sách khách hàng.',
            'error' => $e->getMessage()
        ], 500);
    }
}


    /**
     * 🔍 Tìm khách hàng theo số điện thoại
     * Endpoint: GET /api/customers/search?phone=0901234567
     */
    public function search(Request $request)
    {
        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json([
                'message' => 'Vui lòng nhập số điện thoại cần tìm.'
            ], 400);
        }

        $customer = Customer::where('phone', $phone)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Không tìm thấy khách hàng nào với số điện thoại này.'
            ], 404);
        }

        return response()->json([
            'customer_id' => $customer->customer_id,
            'name'        => $customer->name,
            'phone'       => $customer->phone,
            'points'      => $customer->points,
            'created_at'  => $customer->created_at,
        ]);
    }

    /**
     * ➕ Thêm khách hàng mới
     * Endpoint: POST /api/customers
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|max:255',
            'phone'  => 'nullable|string|max:15|unique:customers,phone',
            'points' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors'  => $validator->errors(),
            ], 400);
        }

        try {
            $customer = Customer::create($validator->validated());
            return response()->json([
                'message' => 'Thêm khách hàng thành công!',
                'data'    => $customer
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi thêm khách hàng.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✏️ Cập nhật thông tin khách hàng
     * Endpoint: PUT /api/customers/{id}
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Không tìm thấy khách hàng.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|max:255',
            'phone'  => 'nullable|string|max:15|unique:customers,phone,' . $id . ',customer_id',
            'points' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors'  => $validator->errors(),
            ], 400);
        }

        try {
            $customer->update($validator->validated());
            return response()->json([
                'message' => 'Cập nhật khách hàng thành công!',
                'data'    => $customer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật khách hàng.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ❌ Xóa khách hàng
     * Endpoint: DELETE /api/customers/{id}
     */
    public function destroy($id)
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json(['message' => 'Không tìm thấy khách hàng.'], 404);
            }

            $customer->delete();

            return response()->json(['message' => 'Xóa khách hàng thành công.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa khách hàng.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
