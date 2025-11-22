import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// URL API Backend Laravel của bạn
const API_BASE_URL = "http://localhost:8000/api/roles";

// --- Component RoleFormModal ---

const RoleFormModal = ({ isOpen, onClose, roleData, onSave }) => {
  if (!isOpen) return null;

  const title = roleData ? "Chỉnh Sửa Vai Trò" : "Thêm Vai Trò Mới";
  const buttonText = roleData ? "Cập Nhật Vai Trò" : "Thêm Vai Trò";

  const [name, setName] = useState(roleData?.name || "");
  const [description, setDescription] = useState(roleData?.description || "");

  // Cập nhật state khi roleData thay đổi (khi mở modal chỉnh sửa)
  useEffect(() => {
    setName(roleData?.name || "");
    setDescription(roleData?.description || "");
  }, [roleData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    // Gọi hàm onSave được truyền từ component cha
    onSave({
      id: roleData ? roleData.id : null,
      name,
      description,
    });

    // Đóng modal và reset form
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform scale-95 animate-scale-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Tên Vai Trò <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              id="name"
              type="text"
              placeholder="Ví dụ: Admin, Editor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="description"
            >
              Mô Tả
            </label>
            <textarea
              className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              id="description"
              rows="4"
              placeholder="Mô tả chi tiết về vai trò này."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition duration-200"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Component RoleManagement ---

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Lấy Danh sách Role
  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      // Giả định backend Laravel trả về data: { roles: [...] }
      setRoles(response.data.roles || response.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Roles:", err);
      setError("Không thể tải dữ liệu vai trò. Vui lòng kiểm tra kết nối API.");
      setRoles([]); // Đảm bảo roles là mảng rỗng nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // Chỉ chạy khi component được mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // 2. Thêm/Cập nhật Role
  const handleSaveRole = async (roleData) => {
    try {
      if (roleData.id) {
        // Cập nhật (PUT/PATCH)
        await axios.put(`${API_BASE_URL}/${roleData.id}`, roleData);
      } else {
        // Thêm mới (POST)
        await axios.post(API_BASE_URL, roleData);
      }
      // Tải lại danh sách sau khi lưu thành công
      fetchRoles();
    } catch (err) {
      alert("Lỗi khi lưu vai trò. Vui lòng thử lại.");
      console.error("Save Error:", err.response ? err.response.data : err);
    }
  };

  // 3. Xóa Role
  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Vai trò #${id} này?`)) {
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      // Cập nhật UI ngay lập tức hoặc tải lại danh sách
      // setRoles(roles.filter(role => role.id !== id));
      fetchRoles();
    } catch (err) {
      alert("Lỗi khi xóa vai trò. Vui lòng thử lại.");
      console.error("Delete Error:", err.response ? err.response.data : err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDERING LOGIC ---

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-center text-xl font-medium text-blue-600">
        Đang tải dữ liệu từ Backend... 🔄
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      {/* HEADER & ACTION BAR */}
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          <span className="bg-blue-600 p-2 rounded-lg mr-3 text-white">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 00-2 2v4m0 0a2 2 0 002 2h4m-4 2c0 1.105.895 2 2 2h4.586a2 2 0 001.414-.586l1.414-1.414a2 2 0 00-.586-1.414m-5.414 0L9 15m0 0l-1 1m6.5-12a2 2 0 110 4 2 2 0 010-4zm-8 4a2 2 0 110 4 2 2 0 010-4z"
              ></path>
            </svg>
          </span>
          Quản Lý Vai Trò
        </h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center group"
        >
          <PlusIcon className="w-5 h-5 mr-2 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
          Thêm Vai Trò Mới
        </button>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* SEARCH/FILTER BAR */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả vai trò..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ROLE TABLE */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên Vai Trò
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mô Tả
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Số Users
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ngày Tạo
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-blue-50 transition duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-blue-700">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                    {role.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.users || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenEditModal(role)}
                      className="text-indigo-600 hover:text-indigo-800 bg-indigo-100 p-2.5 rounded-full hover:shadow-md transform hover:scale-110 transition duration-200"
                      title="Chỉnh sửa vai trò"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-800 bg-red-100 p-2.5 rounded-full hover:shadow-md transform hover:scale-110 transition duration-200"
                      title="Xóa vai trò"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500 text-lg"
                >
                  {!isLoading &&
                    "Chưa có vai trò nào được tạo hoặc không tìm thấy kết quả phù hợp."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ROLE FORM MODAL */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleData={editingRole}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default RoleManagement;
