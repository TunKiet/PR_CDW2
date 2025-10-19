<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Đăng ký tài khoản mới
     */
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|unique:users,phone',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'username' => explode('@', $request->email)[0],
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user', // Mặc định user thường
            'status' => 1,
        ]);

        // Sinh token JWT cho user sau khi đăng ký
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'role' => $user->role ?? 'user', // vì chưa có quan hệ role model
            'token' => $token
        ], 201);
    }

    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check(value: $request->password, hashedValue: $user->password)) {
            return response()->json(['message' => 'Số điện thoại hoặc mật khẩu không đúng!'], 401);
        }

        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Không thể tạo token!'], 500);
        }

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'role' => $user->role ?? 'user',
            'token' => $token
        ], 200);
    }

    /**
     * Lấy thông tin người dùng hiện tại (dành cho Frontend)
     */
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json($user);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn!'], 401);
        }
    }

    /**
     * Đăng xuất (hủy token)
     */
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Đăng xuất thành công!']);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Không thể đăng xuất!'], 500);
        }
    }
}
