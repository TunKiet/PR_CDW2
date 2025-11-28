import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllPermission } from "../data/PermissionData";

const AddRoleModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  const [errors, setErrors] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await getAllPermission();
      const data = Array.isArray(res) ? res : res?.data ?? res;
      setAllPermissions(data || []);
    } catch (err) {
      console.error("Lỗi tải quyền:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Tên vai trò không được để trống";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      try {
        await onAdd(formData);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Thêm Vai Trò Mới
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên vai trò <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ví dụ: Admin, Manager, Staff..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              rows="3"
              placeholder="Mô tả vai trò này..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quyền hạn
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto">
              {allPermissions.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có quyền nào</p>
              ) : (
                <div className="space-y-2">
                  {allPermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <div>
                        <div className="font-medium text-sm">{permission.name}</div>
                        {permission.description && (
                          <div className="text-xs text-gray-500">{permission.description}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Đã chọn: {formData.permissions.length} quyền
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm vai trò"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
