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
        $roles = Role::getAllRoles();
        return response()->json($roles);
    }

    // Tạo mới vai trò
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name|max:255',
            'description' => 'nullable|string|max:500'
        ]);

        // Tạo role mới
        // kiem tra va goi ham addRole

        if($request[1] = Role::getAllRoles())
        {
            return response()->json(['message' => 'Vai trò đã tồn tại!'], 400);
        }
        else
        {
            $role = Role::addRole($request->only(['name', 'description']));
        }

        // Gán quyền nếu có
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'message' => 'Tạo vai trò thành công!',
            'role' => $role
        ]);
    }

    // Hiển thị chi tiết 1 vai trò
    public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json($role);
    }

    // Cập nhật vai trò
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|max:255|unique:roles,name,' . $id,
            'description' => 'nullable|string|max:500'
        ]);

        $role = Role::updateRole($id, $request->only(['name', 'description']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'message' => 'Cập nhật vai trò thành công!',
            'role' => $role
        ]);
    }

    // Xóa vai trò
    public function destroy($id)
    {
        if($role = Role::deleteRole($id))
        {
            return response()->json(['message' => 'Xóa vai trò thành công!']);
        }
        else{
            return response()->json(['message' => 'Xóa vai trò thất bại!'], 400);
        }
    }
}
