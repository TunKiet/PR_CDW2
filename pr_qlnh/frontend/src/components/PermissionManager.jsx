// src/components/PermissionManager.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Search, Shield, Trash2, Edit, Plus } from "lucide-react";
import "../pages/Dashboard/Sales_Statistics_Dashboard.css";
import {
  getAllPermission,
  addPermission,
  updatePermission,
  deletePermission,
} from "../data/PermissionData";

const PermissionManager = () => {
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const res = await getAllPermission();
      const data = Array.isArray(res) ? res : res?.data ?? res;
      setPermissions(data || []);
    } catch (err) {
      console.error("Đỗi tải quyền:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async (permissionData) => {
    try {
      await addPermission(permissionData);
      setShowAddModal(false);
      await loadPermissions();
      alert("Thêm quyền thành công!");
    } catch (err) {
      console.error("Lỗi thêm quyền:", err);
      const errorMsg = err.response?.data?.message || "Thêm quyền lỗi. Kiểm tra console.";
      alert(errorMsg);
    }
  };

  const handleUpdatePermission = async (updatedData) => {
    try {
      const id = selectedPermission?.id;
      if (!id) return;
      await updatePermission(id, updatedData);
      setShowEditModal(false);
      setSelectedPermission(null);
      await loadPermissions();
      alert("Cập nhật quyền thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật quyền:", err);
      
      // Xử lý trường hợp đã bị xóa ở tab khác
      if (err.response?.status === 404 && err.response?.data?.deleted) {
        alert(`⚠️ ${err.response.data.message}\n\nVui lòng tải lại trang để cập nhật dữ liệu mới nhất.`);
        setShowEditModal(false);
        setSelectedPermission(null);
        await loadPermissions();
      } else {
        const errorMsg = err.response?.data?.message || "Cập nhật lỗi.";
        alert(`Lỗi: ${errorMsg}`);
      }
    }
  };

  const handleDeletePermission = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa quyền "${name}" không?`)) return;
    
    try {
      await deletePermission(id);
      await loadPermissions();
      alert("Xóa quyền thành công!");
    } catch (err) {
      console.error("❌ Lỗi xóa quyền:", err);
      
      // Xử lý trường hợp đã bị xóa ở tab khác
      if (err.response?.status === 404 && err.response?.data?.deleted) {
        alert(`⚠️ ${err.response.data.message}\n\nDữ liệu đã được cập nhật.`);
        await loadPermissions();
      } else if (err.response?.status === 400) {
        // Quyền đang được sử dụng bởi vai trò
        const errorData = err.response.data;
        alert(`❌ ${errorData.message}\n\nSố vai trò: ${errorData.roles_count || 0}`);
      } else {
        const errorMsg = err.response?.data?.message || "Xóa lỗi.";
        alert(`Lỗi: ${errorMsg}`);
      }
    }
  };

  const filteredPermissions = permissions.filter((permission) => {
    const lower = searchTerm.toLowerCase();
    return (
      (permission.name || "").toLowerCase().includes(lower) ||
      (permission.description || "").toLowerCase().includes(lower)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="w-64" />
      <main className="dish-main">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Quản Lý Quyền
          </h1>
          <div className="flex justify-between items-center mb-6 space-x-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm quyền theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadPermissions}
                className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                Tải lại
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition flex items-center gap-2"
              >
                <Plus size={20} />
                Thêm quyền
              </button>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên quyền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số vai trò
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : filteredPermissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Không có quyền nào
                    </td>
                  </tr>
                ) : (
                  filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permission.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="text-indigo-600 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-900">
                            {permission.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {permission.description || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {permission.roles_count || 0} vai trò
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedPermission(permission);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePermission(permission.id, permission.name)}
                          className={`${
                            (permission.roles_count || 0) > 0
                              ? 'text-gray-400 hover:text-gray-600 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={
                            (permission.roles_count || 0) > 0
                              ? `Không thể xóa - Có ${permission.roles_count} vai trò`
                              : 'Xóa quyền'
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Permission Modal */}
      {showAddModal && (
        <PermissionModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPermission}
          title="Thêm Quyền Mới"
        />
      )}

      {/* Edit Permission Modal */}
      {showEditModal && selectedPermission && (
        <PermissionModal
          permission={selectedPermission}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPermission(null);
          }}
          onSave={handleUpdatePermission}
          title="Chỉnh Sửa Quyền"
        />
      )}
    </div>
  );
};

// Permission Modal Component
const PermissionModal = ({ permission, onClose, onSave, title }) => {
  const [formData, setFormData] = useState({
    name: permission?.name || "",
    description: permission?.description || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên quyền không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên quyền <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ví dụ: view_users, edit_orders..."
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
              placeholder="Mô tả quyền này..."
            />
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
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;
