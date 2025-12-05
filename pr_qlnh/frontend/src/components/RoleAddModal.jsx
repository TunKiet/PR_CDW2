import React, { useState } from "react";
import { X, Shield } from "lucide-react";

/**
 * Modal thêm vai trò mới
 * Props:
 * - onClose: fn
 * - onAdd: fn(roleData) // { name, description }
 */
const RoleAddModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Tên vai trò không được để trống";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên vai trò không được quá 100 ký tự";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "Mô tả không được quá 255 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onAdd({
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Thêm vai trò mới
              </h2>
              <p className="text-sm text-gray-500">
                Tạo vai trò mới cho hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
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
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ví dụ: Manager, Staff, Admin"
              autoFocus
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
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mô tả vai trò và trách nhiệm..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Lưu ý:</strong> Sau khi tạo vai trò, bạn có thể gán
            quyền hạn cụ thể cho vai trò này.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            Thêm vai trò
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleAddModal;
