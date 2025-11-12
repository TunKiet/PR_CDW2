import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";
import CustomerTable from "../components/CustomerTable";
import CustomerDetailsModal from "../components/CustomerDetailsModal";

const API_URL = "http://127.0.0.1:8000/api/customers";

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 🔹 Lấy danh sách khách hàng khi load trang
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API_URL);
      setCustomers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    }
  };

  // 🔹 Thêm khách hàng
  const handleAddCustomer = async () => {
    try {
      const newCustomer = { name: "Khách hàng mới", phone: "", points: 0 };
      const res = await axios.post(API_URL, newCustomer);
      setCustomers([res.data.data, ...customers]);
      setSelectedCustomer(res.data.data);
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
    }
  };

  // 🔹 Lưu chỉnh sửa khách hàng
  const handleSaveCustomer = async (updatedCustomer) => {
    try {
      await axios.put(`${API_URL}/${updatedCustomer.customer_id}`, updatedCustomer);
      fetchCustomers();
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
    }
  };

  // 🔹 Xóa khách hàng
  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này không?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error("Lỗi khi xóa khách hàng:", error);
      }
    }
  };

  // 🔍 Lọc khách hàng theo tên hoặc SĐT
  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Quản Lý Khách Hàng & Tích Điểm
        </h1>

        <div className="flex justify-between items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <button
            onClick={handleAddCustomer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md"
          >
            + Thêm Khách Hàng
          </button>
        </div>

        {/* Bảng danh sách khách hàng */}
        <CustomerTable
          customers={filteredCustomers}
          onViewDetails={setSelectedCustomer}
          onDelete={handleDeleteCustomer}
        />
      </div>

      {/* Modal xem/chỉnh sửa khách hàng */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;
