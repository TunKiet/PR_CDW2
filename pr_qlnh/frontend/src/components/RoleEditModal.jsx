import React, { useState, useEffect } from "react";
import { X, Shield, Users, Check } from "lucide-react";
import { getAllPermission } from "../data/PermissionData";
import axiosClient from "../api/axiosClient";

/**
 * Modal chỉnh sửa vai trò
 * Props:
 * - role: object { id, name, description, users_count, permissions_count }
 * - onClose: fn
 * - onSave: fn(updatedFields) // { name, description }
 * - onDelete: fn()
 */
const RoleEditModal = ({ role, onClose, onSave, onDelete }) => {
  const [edited, setEdited] = useState({
    name: role?.name ?? "",
    description: role?.description ?? "",
  });

  const [errors, setErrors] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Load tất cả permissions và permissions của role
  useEffect(() => {
    loadPermissions();
  }, [role?.id]);

  const loadPermissions = async () => {
    setLoadingPermissions(true);
    try {
      // Lấy tất cả permissions
      const allPerms = await getAllPermission();
      const permsData = Array.isArray(allPerms) ? allPerms : allPerms?.data ?? [];
      setAllPermissions(permsData);

      // Lấy permissions của role hiện tại
      if (role?.id) {
        const response = await axiosClient.get(`/roles/${role.id}`);
        const rolePermissions = response.data?.permissions || [];
        // Lấy array các permission IDs
        const permIds = rolePermissions.map(p => p.id || p);
        setSelectedPermissions(permIds);
      }
    } catch (err) {
      console.error("❌ Lỗi tải quyền:", err);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
    // Clear error khi user bắt đầu sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!edited.name.trim()) {
      newErrors.name = "Tên vai trò không được để trống";
    } else if (edited.name.length > 100) {
      newErrors.name = "Tên vai trò không được quá 100 ký tự";
    }

    if (edited.description && edited.description.length > 255) {
      newErrors.description = "Mô tả không được quá 255 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    // Lưu thông tin cơ bản
    onSave({
      name: edited.name.trim(),
      description: edited.description.trim(),
    });
  };

  const handleSavePermissions = async () => {
    setSavingPermissions(true);
    try {
      await axiosClient.post(`/roles/${role.id}/permissions`, {
        permissions: selectedPermissions
      });
      alert("✅ Cập nhật quyền thành công!");
      await loadPermissions(); // Reload để cập nhật
    } catch (err) {
      console.error("❌ Lỗi cập nhật quyền:", err);
      const errorMsg = err.response?.data?.message || "Cập nhật quyền lỗi";
      alert(`Lỗi: ${errorMsg}`);
    } finally {
      setSavingPermissions(false);
    }
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleDelete = () => {
    onDelete();
  };

  const usersCount = role?.users_count || 0;
  const permissionsCount = role?.permissions_count || 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="text-indigo-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chỉnh sửa vai trò
              </h2>
              <p className="text-sm text-gray-500">ID: {role?.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-800">
                Người dùng
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{usersCount}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-green-600" />
              <span className="text-xs font-medium text-green-800">
                Quyền hạn
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {permissionsCount}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên vai trò <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={edited.name}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên vai trò"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={edited.description}
              onChange={handleChange}
              rows={3}
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mô tả vai trò"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Warning nếu có người dùng */}
        {usersCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Lưu ý:</strong> Vai trò này đang được sử dụng bởi{" "}
              <strong>{usersCount}</strong> người dùng. Không thể xóa.
            </p>
          </div>
        )}

        {/* Quản lý quyền */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" />
              Quyền hạn
            </h3>
            <button
              onClick={handleSavePermissions}
              disabled={savingPermissions}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {savingPermissions ? "Đang lưu..." : "Lưu quyền"}
            </button>
          </div>

          {loadingPermissions ? (
            <div className="text-center py-4 text-gray-500">
              Đang tải quyền...
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {allPermissions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Không có quyền nào
                </div>
              ) : (
                <div className="divide-y">
                  {allPermissions.map((permission) => {
                    const isSelected = selectedPermissions.includes(permission.id);
                    return (
                      <label
                        key={permission.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePermission(permission.id)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                          {isSelected && (
                            <Check
                              size={14}
                              className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {permission.name}
                          </p>
                          {permission.description && (
                            <p className="text-xs text-gray-500">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mt-2 text-sm text-gray-600">
            Đã chọn: <strong>{selectedPermissions.length}</strong> /{" "}
            {allPermissions.length} quyền
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <button
            onClick={handleDelete}
            disabled={usersCount > 0}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              usersCount > 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            title={
              usersCount > 0
                ? `Không thể xóa - Có ${usersCount} người dùng`
                : "Xóa vai trò"
            }
          >
            Xóa
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEditModal;
