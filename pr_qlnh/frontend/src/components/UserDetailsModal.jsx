// src/components/UserDetailsModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllRole } from "../data/RoleData";

/**
 * Props:
 * - user: object returned from API (user_id, full_name, email, phone, status, roles)
 * - onClose: fn
 * - onSave: fn(updatedFields)  // { full_name, email, phone, status }
 * - onDelete: fn() // delete this user
 */
const UserDetailsModal = ({ user, onClose, onSave, onDelete }) => {
  const [edited, setEdited] = useState({
    full_name: user?.full_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    status: user?.status ?? 1,
    role_id: user?.role_id ?? null,
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await getAllRole();
      const data = Array.isArray(res) ? res : res?.data ?? res;
      setRoles(data || []);
    } catch (err) {
      console.error("Lỗi tải vai trò:", err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusToggle = () => {
    setEdited((prev) => ({ ...prev, status: prev.status === 1 ? 0 : 1 }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!edited.full_name.trim()) {
      newErrors.full_name = "Họ và tên không được để trống";
    }
    
    if (!edited.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(edited.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!edited.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(edited.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        full_name: edited.full_name,
        email: edited.email,
        phone: edited.phone,
        status: edited.status,
        role_id: edited.role_id,
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên có mã ${user.user_id} không?`)) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Mã Nhân Viên: {user.user_id}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={edited.full_name}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={edited.email}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={edited.phone}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái tài khoản</label>
            <div className="flex items-center justify-between mt-2 p-3 border rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  edited.status === 1 ? "bg-green-500" : "bg-red-500"
                }`}></div>
                <span className={`font-medium ${
                  edited.status === 1 ? "text-green-700" : "text-red-700"
                }`}>
                  {edited.status === 1 ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                </span>
              </div>
              <button
                onClick={handleStatusToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  edited.status === 1
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {edited.status === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vai trò <span className="text-red-500">*</span>
            </label>
            {loadingRoles ? (
              <div className="w-full mt-1 border rounded-md p-2 bg-gray-100 text-gray-500">
                Đang tải vai trò...
              </div>
            ) : (
              <select
                name="role_id"
                value={edited.role_id || ""}
                onChange={handleChange}
                className="w-full mt-1 border rounded-md p-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">-- Chọn vai trò --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Vai trò hiện tại: {user.roles || "Chưa có"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Xóa
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Lưu thay đổi
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
