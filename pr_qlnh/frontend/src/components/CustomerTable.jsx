// src/components/CustomerTable.jsx
import React from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';

const CustomerTable = ({ customers = [], onViewDetails, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÃ KH</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TÊN KHÁCH HÀNG</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ĐIỂM TÍCH LŨY</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">THAO TÁC</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.customer_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.phone || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                  {customer.points ?? 0} điểm
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  <button
                    onClick={() => onViewDetails(customer)}
                    className="text-gray-500 hover:text-indigo-600 p-1"
                    title="Xem chi tiết"
                  >
                    <MoreVertical size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(customer.customer_id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Xóa khách hàng"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                Chưa có khách hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer / Pagination */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <span className="text-sm text-gray-600">
          Tổng: {customers.length} khách hàng
        </span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
            Trước
          </button>
          <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg">
            1
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
