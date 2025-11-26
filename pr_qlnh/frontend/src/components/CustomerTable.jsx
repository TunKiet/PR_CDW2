// src/components/CustomerTable.jsx
import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { formatCurrency, getRankByPoints, getRankColor } from "../data/customerData";

const CustomerTable = ({ customers = [], onViewDetails, onDelete, loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÃ KH</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TÊN KHÁCH HÀNG</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TỔNG CHI TIÊU</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ĐIỂM TÍCH LŨY</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HẠNG</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">THAO TÁC</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">Chưa có khách hàng</td>
            </tr>
          ) : (
            customers.map((c) => {
              const id = c.customer_id ?? c.id;
              const rank = getRankByPoints(c.points ?? 0);
              return (
                <tr key={id} className="hover:bg-gray-50">
                  
                  {/* Mã KH */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`KH${id}`}
                  </td>

                  {/* Tên */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {c.name || "Khách lẻ"}
                  </td>

                  {/* SĐT */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {c.phone || "—"}
                  </td>

                  {/* Tổng chi tiêu */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(c.total_spent ?? c.totalSpent ?? 0)}
                  </td>

                  {/* Điểm */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                    {(c.points ?? 0).toLocaleString()} điểm
                  </td>

                  {/* Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRankColor(rank)}`}>
                      {rank}
                    </span>
                  </td>

                  {/* Action */}
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

      {/* Footer */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <span className="text-sm text-gray-600">Hiển thị {customers.length} khách hàng</span>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">Trước</button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg">1</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">Sau</button>
        </div>
      </div>

    </div>
  );
};

export default CustomerTable;
