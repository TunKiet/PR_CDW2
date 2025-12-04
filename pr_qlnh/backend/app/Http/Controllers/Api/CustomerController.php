<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * 📋 Lấy danh sách khách hàng
     */
    public function index()
    {
        $customers = Customer::orderBy('customer_id', 'desc')->get();

        return $customers->map(function ($c) {
            return [
                'customer_id' => $c->customer_id,
                'name'        => $c->name,
                'phone'       => $c->phone,
                'total_spent' => $c->total_spent,
                'points'      => $c->points,
                'rank'        => $this->getRankName($c->points),
            ];
        });
    }

    /**
     * 🔍 Tìm khách hàng theo số điện thoại
     */
    public function search(Request $request)
    {
        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json([
                'message' => 'Vui lòng nhập số điện thoại!',
            ], 400);
        }

        $customer = Customer::where('phone', $phone)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Không tìm thấy khách hàng!',
                'exists' => false,
            ], 200);
        }

        return response()->json([
            'exists' => true,
            'customer_id' => $customer->customer_id,
            'customer_name' => $customer->name,
            'phone' => $customer->phone,
            'points' => $customer->points,
            'rank' => $this->getRankName($customer->points),
        ]);
    }

    /**
     * ➕ Tạo khách hàng
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'   => 'nullable|string|max:255',
            'phone'  => 'nullable|string|max:15|unique:customers,phone',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors'  => $validator->errors()], 400);
        }

        $customer = Customer::create([
            'name'        => $request->name,
            'phone'       => $request->phone,
            'total_spent' => 0,
            'points'      => 0,
        ]);

        return response()->json(['message' => 'Tạo thành công', 'data' => $customer], 201);
    }

    /**
     * ✏ Cập nhật khách hàng
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $customer->update([
            'name'  => $request->name,
            'phone' => $request->phone,
        ]);

        return response()->json(['message' => 'Cập nhật thành công', 'data' => $customer]);
    }

    /**
     * 🗑 Xoá khách hàng
     */
    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $customer->delete();

        return response()->json(['message' => 'Đã xóa']);
    }

    /**
     * 🎖 Logic xếp hạng mới
     */
    private function getRankName($points)
    {
        if ($points >= 50000) return "Kim Cương";
        if ($points >= 15000) return "Vàng";
        if ($points >= 5000)  return "Bạc";
        return "Đồng";
    }
}