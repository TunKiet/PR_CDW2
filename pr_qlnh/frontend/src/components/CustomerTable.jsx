// src/components/CustomerTable.jsx
import React, { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { formatCurrency, getRankByPoints, getRankColor } from "../data/customerData";

const CustomerTable = ({ customers = [], onViewDetails, onDelete, loading = false }) => {
  // -----------------------------
  // 🔥 PHÂN TRANG
  // -----------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // số KH mỗi trang

  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-300 text-center">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">MÃ KH</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">TÊN KHÁCH HÀNG</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">SĐT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">TỔNG CHI TIÊU</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">ĐIỂM TÍCH LŨY</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">HẠNG</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">THAO TÁC</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200 text-center">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-900">Đang tải dữ liệu...</td>
            </tr>
          ) : paginatedCustomers.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-900">Chưa có khách hàng</td>
            </tr>
          ) : (
            paginatedCustomers.map((c) => {
              const id = c.customer_id ?? c.id;
              const rank = getRankByPoints(c.points ?? 0);

              return (
                <tr key={id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`KH${id}`}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {c.name || "Khách lẻ"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {c.phone || "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(c.total_spent ?? c.totalSpent ?? 0)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                    {(c.points ?? 0).toLocaleString()} điểm
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRankColor(rank)}`}>
                      {rank}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onViewDetails && onViewDetails(c)} 
                      className="text-gray-500 hover:text-indigo-600 p-1"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {onDelete && (
                      <button 
                        onClick={() => onDelete(id)} 
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ------------------ PHÂN TRANG ------------------ */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <span className="text-sm text-gray-600">
          Hiển thị {paginatedCustomers.length}/{customers.length} khách hàng
        </span>

        {totalPages > 1 && (
          <div className="flex space-x-2">

            {/* Trang trước */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg disabled:opacity-40"
            >
              Trước
            </button>

            {/* Số trang */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Trang sau */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTable;
