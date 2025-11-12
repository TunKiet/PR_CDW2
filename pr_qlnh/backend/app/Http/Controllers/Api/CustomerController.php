<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index() {
        return Customer::all();
    }

    public function store(Request $request) {
        return Customer::create($request->all());
    }

    public function update(Request $request, $id) {
        $customer = Customer::findOrFail($id);
        $customer->update($request->all());
        return $customer;
    }

    public function destroy($id) {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return response()->noContent();
    }
}
