import React from "react";
import { Edit2, Trash2, Users, MapPin, Info } from "lucide-react";

const getStatusClass = (status) => {
  switch (status) {
    case "Trống":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Đang sử dụng":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Đã đặt":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

export default function TableList({ tables = [], onEdit, onDelete }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-1 border-b bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
        <h2 className="text-lg font-semibold text-gray-700">
          Danh sách bàn
        </h2>
        <span className="text-sm font-medium text-gray-600 bg-white px-4 py-1.5 rounded-full border border-gray-200">
          Tổng: <strong className="text-indigo-600">{tables.length}</strong> bàn
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2 ps-3">
                  <Info size={16} className="text-gray-400" />
                  Tên Bàn
                </div>
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  Sức Chứa
                </div>
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  Khu Vực
                </div>
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng Thái
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {tables.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl mb-3">🍽️</div>
                    <p className="text-gray-500 text-base">Chưa có bàn nào được thêm</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Vui lòng thêm bàn mới để bắt đầu quản lý
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              tables
                  .sort((a, b) => b.table_id - a.table_id)   // Sắp xếp theo mới nhất → cũ nhất
                .map((table) => (
                  <tr
                    key={table.table_id}
                    className="hover:bg-indigo-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap ps-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {table.table_name}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-700 font-medium">
                        {table.capacity}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">người</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {table.table_type || "Không rõ"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-full ${getStatusClass(
                          table.status
                        )}`}
                      >
                        {table.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(table)}
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all p-2 rounded-lg"
                        >
                          <Edit2 size={16} />
                          <span className="text-sm font-medium">Sửa</span>
                        </button>

                        <button
                          onClick={() => onDelete(table)}
                          className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all p-2 rounded-lg"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm font-medium">Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}