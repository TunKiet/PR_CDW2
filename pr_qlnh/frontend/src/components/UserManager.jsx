// src/pages/UserManagementPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserTable from "../components/UserTable";
import UserDetailsModal from "../components/UserDetailsModal";
import { Search } from "lucide-react";
import "../pages/Dashboard/Sales_Statistics_Dashboard.css";
import {
  getAllUser,
  addUser,
  updateUser,
  deleteUser,
  searchUser,
} from "../data/UserData";

const UserManagementPage = () => {
  const [User, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await getAllUser();
      const data = Array.isArray(res) ? res : res?.data ?? res;
      setUser(data || []);
    } catch (err) {
      console.error("Lỗi tải nhân viên:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const payload = { name: "nhân viên mới", phone: "" };
      const res = await addUser(payload);
      // support different shapes
      const newUser = res?.data ?? res;
      // if wrapper { data: User }:
      const item = newUser?.data ?? newUser;
      setUser((prev) => [item, ...prev]);
      setSelectedUser(item);
    } catch (err) {
      console.error("Lỗi thêm nhân viên:", err);
      alert("Thêm nhân viên lỗi. Kiểm tra console.");
    }
  };

  const handleSaveUser = async (updatedFields) => {
    try {
      const id = selectedUser?.user_id;
      if (!id) {
        console.error("Không có mã người dùng để update");
        return;
      }
      await updateUser(id, updatedFields);
      setSelectedUser(null);
      await loadUser();
    } catch (err) {
      console.error("Lỗi cập nhật nhân viên:", err);
      alert("Cập nhật lỗi. Kiểm tra console.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên có mã ${id} này không?`)) return;
    try {
      await deleteUser(id);
      await loadUser();
    } catch (err) {
      console.error("Lỗi xóa nhân viên:", err);
      alert("Xóa lỗi. Kiểm tra console.");
    }
  };

  // local filter OR server search by phone
  const handleSearch = async (value) => {
    setSearchTerm(value);
    const trimmed = value.trim();
    // if looks like a phone (digits and length >= 6) then call API search
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length >= 6) {
      try {
        const res = await searchUser(digits);
        const data = res?.data ?? res;
        const item = data?.data ?? data;
        if (item && !Array.isArray(item)) {
          setUser([item]);
          return;
        }
      } catch (err) {
        // if not found, just fallback to client filtering
        // console.warn("Search API failed, fallback to client filter", err);
      }
    }

    // fallback client-side filter on loaded User
    if (!trimmed) {
      loadUser();
    } else {
      const lower = trimmed.toLowerCase();
      setUser((prev) =>
        prev.filter(
          (c) =>
            (c.name || "").toLowerCase().includes(lower) ||
            (c.phone || "").includes(trimmed) ||
            (String(c.user_id || c.id || "") || "").includes(trimmed)
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
            Quản Lý nhân viên
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
                onClick={loadUser}
                className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                Tải lại
              </button>

              <button
                onClick={handleAddUser}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition"
              >
                + Thêm nhân viên
              </button>
            </div>
          </div>
          <UserTable
            users={User}
            onViewDetails={(c) => setSelectedUser(c)}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        </div>
      </main>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
          onDelete={() => handleDeleteUser(selectedUser.user_id)}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
