<?php

namespace App\Http\Controllers;

use App\Models\User;
use Dom\Element;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Lấy danh sách tất cả người dùng
    public function index()
    {
        $users = User::getAllUsers();
        return response()->json($users);
    }
    // Lấy chi tiết người dùng theo ID
    public function show($id)
    {
        $user = User::getUserById($id);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        } else {
            return response()->json($user);
        }
    }
    // Them nguoi dung
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|unique:users,phone',
            'password' => 'required|min:6',
        ]);

        // Tạo user mới
        $user = User::addUser([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'status' => 1,
        ]);

        // Gán role mặc định = customer
        $user->assignRole('customer');

        // Tạo token JWT
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'roles' => $user->roles,
            'token' => $token
        ], 201);
    }
    // Cập nhật người dùng
    public function update(Request $request, $id)
    {
        $id = User::find($id);
        if (!$id) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'phone' => 'sometimes|required|unique:users,phone,' . $id
        ]);

        $user = User::updateUser($id, $request->all());

        return response()->json([
            'message' => 'Cập nhật người dùng thành công!',
            'user' => $user
        ]);
    }
    // Xóa người dùng
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Xóa người dùng thành công!']);
    }
    // Lấy tên vai trò của người dùng theo ID
    public function getRoleByUserId($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        // Lấy tên role, nối thành chuỗi nếu nhiều role
        $roleNames = $user->roles->pluck('name')->join(', ');

        return response()->json($roleNames); // Trả về string, ví dụ "Admin, Manager"
    }

}
