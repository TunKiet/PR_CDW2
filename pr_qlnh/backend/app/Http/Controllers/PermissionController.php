<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission; // ✅ tên model chuẩn là Permission (số ít)

class PermissionController extends Controller
{
    // ✅ Lấy danh sách tất cả quyền
    public function index()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    // ✅ Tạo quyền mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name|max:100',
            'description' => 'nullable|string|max:255'
        ]);

        $permission = Permission::create($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Tạo quyền thành công!',
            'permission' => $permission
        ]);
    }

    // ✅ Xem chi tiết quyền
    public function show($id)
    {
        $permission = Permission::findOrFail($id);
        return response()->json($permission);
    }

    // ✅ Cập nhật quyền
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $request->validate([
            'name' => 'required|max:100|unique:permissions,name,' . $permission->id,
            'description' => 'nullable|string|max:255'
        ]);

        $permission->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Cập nhật quyền thành công!',
            'permission' => $permission
        ]);
    }

    // ✅ Xóa quyền
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Xóa quyền thành công!']);
    }
}
