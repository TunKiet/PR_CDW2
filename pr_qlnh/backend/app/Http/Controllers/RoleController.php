<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // ✅ Lấy danh sách tất cả các vai trò
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    // ✅ Tạo mới vai trò
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name|max:255',
            'description' => 'nullable|string|max:500'
        ]);

        // Tạo role mới
        $role = Role::create($request->only(['name', 'description']));

        // Gán quyền nếu có
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'message' => 'Tạo vai trò thành công!',
            'role' => $role
        ]);
    }

    // ✅ Hiển thị chi tiết 1 vai trò
    public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json($role);
    }

    // ✅ Cập nhật vai trò
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string|max:500'
        ]);

        $role->update($request->only(['name', 'description']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'message' => 'Cập nhật vai trò thành công!',
            'role' => $role
        ]);
    }

    // ✅ Xóa vai trò
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Xóa vai trò thành công!']);
    }
}
