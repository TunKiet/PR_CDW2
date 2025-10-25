import React from "react";
import { Edit2, Trash2, Users, MapPin, Info } from "lucide-react";

const getStatusClass = (status) => {
  switch (status) {
    case "Trống":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Đang sử dụng":
      return "bg-rose-100 text-rose-700 border border-rose-200";
    case "Đã đặt":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

export default function TableList({ tables = [], onEdit, onDelete }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Danh sách bàn ăn
        </h2>
        <span className="text-sm text-gray-500">
          Tổng số bàn: <strong>{tables.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Info size={14} />
                  Tên Bàn
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  Sức Chứa
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  Khu Vực
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {tables.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 italic"
                >
                  Chưa có bàn nào được thêm.
                </td>
              </tr>
            ) : (
              tables
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-indigo-50 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {table.capacity} người
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {table.zone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${getStatusClass(
                          table.status
                        )}`}
                      >
                        {table.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEdit(table)}
                        aria-label={`Sửa ${table.name}`}
                        title="Sửa"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition p-2 rounded-lg hover:bg-indigo-50"
                      >
                        <Edit2 size={16} />
                        <span className="hidden sm:inline">Sửa</span>
                      </button>
                      <button
                        onClick={() => onDelete(table)}
                        aria-label={`Xóa ${table.name}`}
                        title="Xóa"
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 transition p-2 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
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
