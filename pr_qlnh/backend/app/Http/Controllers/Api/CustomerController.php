<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * 📋 Lấy danh sách tất cả khách hàng
     */
    public function index()
    {
        return response()->json(Customer::orderBy('customer_id', 'desc')->get());
    }

    /**
     * ➕ Thêm khách hàng mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'phone' => 'nullable|string|max:30|unique:customers,phone',
            'points' => 'nullable|integer|min:0',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm khách hàng thành công',
            'data' => $customer,
        ], 201);
    }

    /**
     * ✏️ Cập nhật thông tin khách hàng
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'phone' => 'nullable|string|max:30|unique:customers,phone,' . $id . ',customer_id',
            'points' => 'nullable|integer|min:0',
        ]);

        $customer->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin khách hàng thành công',
            'data' => $customer,
        ]);
    }

    /**
     * ❌ Xóa khách hàng
     */
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Khách hàng đã được xóa thành công',
        ]);
    }
}