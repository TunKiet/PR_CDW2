<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

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
        // Them nguoi dung moi va dong thoi them vai tro mac dinh la customer
        $user = User::addUser([
            'username' => explode('@', $request->email)[0],
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'user',
            'status' => 1,
        ]);

        // Sinh token JWT cho user sau khi đăng ký
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'role' => $user->role ?? 'user',
            'token' => $token
        ], 201);
    }

    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|min:6',
            'phone' => 'required_without:email',
            'email' => 'required_without:phone|email',
        ]);

        // Xác định trường đăng nhập
        $loginField = $request->filled('email') ? 'email' : 'phone';
        $identifier = $request->input($loginField);
        //Goi ham lay nguoi dung
        $user = User::getUserbyEmailOrPhone($loginField, $identifier);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email/SĐT hoặc mật khẩu không đúng!'], 401);
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
            'token' => $token,
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
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Đăng xuất thành công!']);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Không thể đăng xuất!'], 500);
        }
    }
}
