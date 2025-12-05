<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Dom\Element;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Lấy danh sách tất cả các vai trò
    public function index()
    {
        $roles = Role::with(['permissions', 'users'])
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'permissions_count' => $role->permissions->count(),
                    'users_count' => $role->users->count(),
                    'permissions' => $role->permissions->pluck('name'),
                    'created_at' => $role->created_at,
                    'updated_at' => $role->updated_at,
                ];
            });
        return response()->json($roles);
    }

    // Tạo mới vai trò
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name|max:255',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::addRole($request->only(['name', 'description']));

        // Gán quyền nếu có
        if ($request->has('permissions') && is_array($request->permissions)) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'message' => 'Tạo vai trò thành công!',
            'role' => $role->load('permissions')
        ], 201);
    }

    // Hiển thị chi tiết 1 vai trò
    public function show($id)
    {
        $role = Role::with(['permissions', 'users'])->findOrFail($id);
        return response()->json([
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'permissions' => $role->permissions,
            'users' => $role->users->map(function($user) {
                return [
                    'user_id' => $user->user_id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                ];
            }),
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
        ]);
    }

    // Cập nhật vai trò
    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        
        if (!$role) {
            return response()->json([
                'message' => 'Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.',
                'deleted' => true
            ], 404);
        }

        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id . '|max:100',
            'description' => 'nullable|string|max:255'
        ]);

        $role->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Cập nhật vai trò thành công!',
            'role' => $role
        ]);
    }

    // Xóa vai trò
    public function destroy($id)
    {
        $role = Role::find($id);
        
        if (!$role) {
            return response()->json([
                'message' => 'Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.',
                'deleted' => true
            ], 404);
        }

        // Kiểm tra ràng buộc: không cho xóa nếu có user đang sử dụng
        $usersCount = $role->users()->count();
        if ($usersCount > 0) {
            return response()->json([
                'message' => "Không thể xóa vai trò này vì có {$usersCount} người dùng đang sử dụng!",
                'users_count' => $usersCount
            ], 400);
        }

        // Xóa các liên kết với permissions trước
        $role->permissions()->detach();
        
        // Xóa role
        $role->delete();

        return response()->json(['message' => 'Xóa vai trò thành công!']);
    }

    // Gán quyền cho vai trò
    public function assignPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role->permissions()->sync($request->permissions);

        return response()->json([
            'message' => 'Gán quyền thành công!',
            'role' => $role->load('permissions')
        ]);
    }

    // Lấy danh sách users có vai trò này
    public function getUsersByRole($id)
    {
        $role = Role::findOrFail($id);
        $users = $role->users()->get()->map(function($user) {
            return [
                'user_id' => $user->user_id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
            ];
        });

        return response()->json($users);
    }

}
