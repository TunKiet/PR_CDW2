// src/pages/RoleManagementPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RoleTable from "../components/RoleTable";
import RoleEditModal from "../components/RoleEditModal";
import RoleAddModal from "../components/RoleAddModal";
import { Search } from "lucide-react";
import "../pages/Dashboard/Sales_Statistics_Dashboard.css";
import {
  getAllRole,
  addRole,
  updateRole,
  deleteRole,
} from "../data/RoleData";

const RoleManagementPage = () => {
  const [Role, setRole] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    setLoading(true);
    try {
      const res = await getAllRole();
      console.log("📥 Response from API:", res);
      const data = Array.isArray(res) ? res : res?.data ?? res;
      console.log("📊 Processed data:", data);
      setRole(data || []);
    } catch (err) {
      console.error("❌ Lỗi tải vai trò:", err);
      console.error("❌ Error details:", err.response?.data || err.message);
      
      // Không hiển thị alert nếu là lỗi token expired (đã xử lý ở interceptor)
      const errorMessage = err.response?.data?.message || err.message;
      if (!errorMessage.includes("expired") && !errorMessage.includes("Token has expired")) {
        alert(`Lỗi tải vai trò: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (roleData) => {
    try {
      const res = await addRole(roleData);
      setShowAddModal(false);
      await loadRole();
      alert("Thêm vai trò thành công!");
    } catch (err) {
      console.error("❌ Lỗi thêm vai trò:", err);
      const errorMsg = err.response?.data?.message || "Thêm vai trò lỗi.";
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const handleSaveRole = async (updatedFields) => {
    try {
      const id = selectedRole?.id;
      if (!id) {
        console.error("Không có mã vai trò để update");
        alert("Không tìm thấy vai trò để cập nhật");
        return;
      }
      await updateRole(id, updatedFields);
      setSelectedRole(null);
      await loadRole();
      alert("Cập nhật vai trò thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật vai trò:", err);
      
      // Xử lý trường hợp đã bị xóa ở tab khác
      if (err.response?.status === 404 && err.response?.data?.deleted) {
        alert(`⚠️ ${err.response.data.message}\n\nVui lòng tải lại trang để cập nhật dữ liệu mới nhất.`);
        setSelectedRole(null);
        await loadRole();
      } else {
        const errorMsg = err.response?.data?.message || err.message || "Cập nhật lỗi";
        alert(`Lỗi: ${errorMsg}`);
      }
    }
  };

  const handleDeleteRole = async (id, roleName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa vai trò "${roleName}" không?`)) return;
    
    try {
      await deleteRole(id);
      await loadRole();
      alert("Xóa vai trò thành công!");
    } catch (err) {
      console.error("❌ Lỗi xóa vai trò:", err);
      
      // Xử lý trường hợp đã bị xóa ở tab khác
      if (err.response?.status === 404 && err.response?.data?.deleted) {
        alert(`⚠️ ${err.response.data.message}\n\nDữ liệu đã được cập nhật.`);
        await loadRole();
      } else if (err.response?.status === 400) {
        // Vai trò đang được sử dụng bởi người dùng
        const errorData = err.response.data;
        alert(`❌ ${errorData.message}\n\nSố người dùng: ${errorData.users_count || 0}`);
      } else {
        const errorMsg = err.response?.data?.message || err.message || "Xóa lỗi";
        alert(`Lỗi: ${errorMsg}`);
      }
    }
  };

  // local filter OR server search by phone
  const handleSearch = (value) => {
    setSearchTerm(value);
    const trimmed = value.trim();

    if (!trimmed) {
      loadRole();
    } else {
      const lower = trimmed.toLowerCase();
      setRole((prev) =>
        prev.filter(
          (c) =>
            (c.name || "").toLowerCase().includes(lower) ||
            (c.description || "").toLowerCase().includes(lower) ||
            (String(c.id || "") || "").includes(trimmed)
        )
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="w-64" />
      <main className="dish-main">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Quản Lý vai trò
          </h1>

          <div className="flex justify-between items-center mb-6 space-x-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                class="ps-5"
                type="text"
                placeholder=" Tìm nhân viên theo tên hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 px-5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadRole}
                className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                Tải lại
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition"
              >
                + Thêm vai trò
              </button>
            </div>
          </div>
          <RoleTable
            roles={Role}
            onViewDetails={(c) => setSelectedRole(c)}
            onDelete={handleDeleteRole}
            loading={loading}
          />
        </div>
      </main>

      {/* Modal thêm vai trò */}
      {showAddModal && (
        <RoleAddModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRole}
        />
      )}

      {/* Modal sửa vai trò */}
      {selectedRole && (
        <RoleEditModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onSave={handleSaveRole}
          onDelete={() => handleDeleteRole(selectedRole.id, selectedRole.name)}
        />
      )}
    </div>
  );
};

export default RoleManagementPage;
