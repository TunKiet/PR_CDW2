// src/components/UserDetailsModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

/**
 * Props:
 * - user: object returned from API (user_id, full_name, email, phone, status, roles)
 * - onClose: fn
 * - onSave: fn(updatedFields)  // { full_name, email, phone }
 * - onDelete: fn() // delete this user
 */
const UserDetailsModal = ({ user, onClose, onSave, onDelete }) => {
  const [edited, setEdited] = useState({
    full_name: user?.full_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({
      full_name: edited.full_name,
      email: edited.email,
      phone: edited.phone,
    });
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
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="full_name"
              value={edited.full_name}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={edited.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={edited.phone}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <input
              type="text"
              value={user.status === 1 ? "Đang hoạt động" : "Vô hiệu hóa"}
              disabled
              className="w-full mt-1 border rounded-md p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
            <input
              type="text"
              value={user.roles || "—"}
              disabled
              className="w-full mt-1 border rounded-md p-2 bg-gray-100"
            />
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
