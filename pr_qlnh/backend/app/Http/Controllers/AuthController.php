<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:role_permissions,email',
            'phone' => 'required|unique:role_permissions,phone',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'username' => explode('@', $request->email)[0], // tạo username tự động
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => md5($request->password),
            'status' => 1,
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
        ], 201);
    }
}
