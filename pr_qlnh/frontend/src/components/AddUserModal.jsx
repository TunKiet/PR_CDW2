// src/components/AddUserModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

/**
 * Props:
 * - onClose: fn
 * - onAdd: fn(userData) // { full_name, email, phone, password }
 */
const AddUserModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Họ và tên không được để trống";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }
    
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Thêm Nhân Viên Mới
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
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập họ và tên"
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
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@email.com"
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
              value={formData.phone}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0123456789"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Tối thiểu 6 ký tự"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Thêm nhân viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
