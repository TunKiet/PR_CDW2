<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
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

    public function search(Request $request)
    {
        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json(['message' => 'Thiếu số điện thoại'], 400);
        }

        $customer = Customer::where('phone', $phone)->first();

        if (!$customer) {
            return response()->json(['message' => 'Không tìm thấy khách hàng'], 404);
        }

        return [
            'customer_id' => $customer->customer_id,
            'name'        => $customer->name,
            'phone'       => $customer->phone,
            'total_spent' => $customer->total_spent,
            'points'      => $customer->points,
            'rank'        => $this->getRankName($customer->points),
        ];
    }

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

    public function destroy($id)
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $customer->delete();
        return response()->json(['message' => 'Đã xóa']);
    }

    private function getRankName($points)
    {
        if ($points >= 15000) return "Kim Cương";
        if ($points >= 5000)  return "Vàng";
        if ($points >= 1500)  return "Bạc";
        return "Đồng";
    }
}
