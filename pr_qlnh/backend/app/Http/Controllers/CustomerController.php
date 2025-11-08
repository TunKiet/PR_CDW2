<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * Tìm khách hàng theo số điện thoại (phone)
     * Endpoint: GET /api/customers/search?phone=0901234567
     */
    public function search(Request $request)
    {
        $phone = $request->query('phone');

        // Kiểm tra có truyền SĐT không
        if (!$phone) {
            return response()->json([
                'message' => 'Vui lòng nhập số điện thoại cần tìm.'
            ], 400);
        }

        // Tìm khách hàng theo SĐT
        $customer = Customer::where('phone', $phone)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Không tìm thấy khách hàng nào với số điện thoại này.'
            ], 404);
        }

        // Trả về dữ liệu khách hàng
        return response()->json([
            'customer_id' => $customer->customer_id,
            'name'        => $customer->name,
            'phone'       => $customer->phone,
            'email'       => $customer->email,
            'points'      => $customer->points,
            'created_at'  => $customer->created_at,
        ]);
    }
}
