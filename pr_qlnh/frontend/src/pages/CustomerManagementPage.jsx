// src/pages/CustomerManagementPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import CustomerTable from "../components/CustomerTable";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import { Search } from "lucide-react";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../data/customerData";

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      // res might be array or res.data
      const data = Array.isArray(res) ? res : res?.data ?? res;
      setCustomers(data || []);
    } catch (err) {
      console.error("Lỗi tải khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      const payload = { name: "Khách hàng mới", phone: "" };
      const res = await addCustomer(payload);
      // support different shapes
      const newCustomer = res?.data ?? res;
      // if wrapper { data: customer }:
      const item = newCustomer?.data ?? newCustomer;
      setCustomers((prev) => [item, ...prev]);
      setSelectedCustomer(item);
    } catch (err) {
      console.error("Lỗi thêm khách hàng:", err);
      alert("Thêm khách hàng lỗi. Kiểm tra console.");
    }
  };

  const handleSaveCustomer = async (updatedFields) => {
    // updatedFields should only contain name + phone
    try {
      const id = selectedCustomer?.customer_id;
      if (!id) {
        console.error("Không có customer_id để update");
        return;
      }
      await updateCustomer(id, updatedFields);
      setSelectedCustomer(null);
      await loadCustomers();
    } catch (err) {
      console.error("Lỗi cập nhật khách hàng:", err);
      alert("Cập nhật lỗi. Kiểm tra console.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này không?")) return;
    try {
      await deleteCustomer(id);
      await loadCustomers();
    } catch (err) {
      console.error("Lỗi xóa khách hàng:", err);
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
        const res = await searchCustomers(digits);
        const data = res?.data ?? res;
        const item = data?.data ?? data; // support payload shapes
        // If backend returns single customer object, display that single one
        if (item && !Array.isArray(item)) {
          setCustomers([item]);
          return;
        }
      } catch (err) {
        // if not found, just fallback to client filtering
        // console.warn("Search API failed, fallback to client filter", err);
      }
    }

    // fallback client-side filter on loaded customers
    if (!trimmed) {
      loadCustomers();
    } else {
      const lower = trimmed.toLowerCase();
      setCustomers((prev) =>
        prev.filter(
          (c) =>
            (c.name || "").toLowerCase().includes(lower) ||
            (c.phone || "").includes(trimmed) ||
            (String(c.customer_id || c.id || "") || "").includes(trimmed)
        )
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Quản Lý Khách Hàng & Tích Điểm
        </h1>

        <div className="flex justify-between items-center mb-6 space-x-4">
          <div className="relative flex-1">         
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input class = "ps-5"
              type="text"
              placeholder=" Tìm khách hàng theo tên hoặc SĐT..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 px-5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            />
            
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadCustomers}
              className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              Tải lại
            </button>

            <button
              onClick={handleAddCustomer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition"
            >
              + Thêm Khách Hàng
            </button>
          </div>
        </div>

        <CustomerTable
          customers={customers}
          onViewDetails={(c) => setSelectedCustomer(c)}
          onDelete={handleDeleteCustomer}
          loading={loading}
        />
      </div>

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
