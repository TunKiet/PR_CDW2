// src/pages/RoleManagementPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RoleTable from "../components/RoleTable";
import RoleDetailsModal from "../components/RoleDetailsModal";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    setLoading(true);
    try {
      const res = await getAllRole();
      const data = Array.isArray(res) ? res : res?.data ?? res;
      setRole(data || []);
    } catch (err) {
      console.error("Lỗi tải vai tro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    try {
      const payload = { name: "vai trò mới", phone: "" };
      const res = await addRole(payload);
      // support different shapes
      const newRole = res?.data ?? res;
      // if wrapper { data: Role }:
      const item = newRole?.data ?? newRole;
      setRole((prev) => [item, ...prev]);
      setSelectedRole(item);
    } catch (err) {
      console.error("Lỗi thêm vai trò", err);
      alert("Thêm vai trò lỗi.");
    }
  };

  const handleSaveRole = async (updatedFields) => {
    try {
      const id = selectedRole?.Role_id;
      if (!id) {
        console.error("Không có mã vai trò để update");
        return;
      }
      await updateRole(id, updatedFields);
      setSelectedRole(null);
      await loadRole();
    } catch (err) {
      console.error("Lỗi cập nhật nhân viên:", err);
      alert("Cập nhật lỗi. Kiểm tra console.");
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên có mã ${id} này không?`)) return;
    try {
      await deleteRole(id);
      await loadRole();
    } catch (err) {
      console.error("Lỗi xóa nhân viên:", err);
      alert("Xóa lỗi. Kiểm tra console.");
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
                onClick={handleAddRole}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition"
              >
                + Thêm nhân viên
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

      {selectedRole && (
        <RoleDetailsModal
          Role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onSave={handleSaveRole}
          onDelete={() => handleDeleteRole(selectedRole.Role_id)}
        />
      )}
    </div>
  );
};

export default RoleManagementPage;
