<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission; // ✅ tên model chuẩn là Permission (số ít)

class PermissionController extends Controller
{
    // ✅ Lấy danh sách tất cả quyền
    public function index()
    {
        $permissions = Permission::with('roles')
            ->get()
            ->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'description' => $permission->description,
                    'roles_count' => $permission->roles->count(),
                    'roles' => $permission->roles->pluck('name'),
                    'created_at' => $permission->created_at,
                    'updated_at' => $permission->updated_at,
                ];
            });
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
        $permission = Permission::with('roles')->findOrFail($id);
        return response()->json([
            'id' => $permission->id,
            'name' => $permission->name,
            'description' => $permission->description,
            'roles' => $permission->roles,
            'created_at' => $permission->created_at,
            'updated_at' => $permission->updated_at,
        ]);
    }

    // ✅ Cập nhật quyền
    public function update(Request $request, $id)
    {
        $permission = Permission::find($id);
        
        if (!$permission) {
            return response()->json([
                'message' => 'Quyền không tồn tại. Có thể đã bị xóa bởi người dùng khác.',
                'deleted' => true
            ], 404);
        }

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
        $permission = Permission::find($id);
        
        if (!$permission) {
            return response()->json([
                'message' => 'Quyền không tồn tại. Có thể đã bị xóa bởi người dùng khác.',
                'deleted' => true
            ], 404);
        }

        // Kiểm tra ràng buộc: không cho xóa nếu có role đang sử dụng
        $rolesCount = $permission->roles()->count();
        if ($rolesCount > 0) {
            return response()->json([
                'message' => "Không thể xóa quyền này vì có {$rolesCount} vai trò đang sử dụng!",
                'roles_count' => $rolesCount
            ], 400);
        }

        $permission->delete();

        return response()->json(['message' => 'Xóa quyền thành công!']);
    }

    // Lấy danh sách roles có quyền này
    public function getRolesByPermission($id)
    {
        $permission = Permission::with('roles')->findOrFail($id);
        return response()->json($permission->roles);
    }
}
