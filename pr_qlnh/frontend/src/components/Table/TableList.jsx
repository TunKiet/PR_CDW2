import React from "react";
import { Edit2, Trash2, Users, MapPin, Info } from "lucide-react";

const getStatusClass = (status) => {
  switch (status) {
    case "Trống":
      // Màu xanh lá cây (Emerald) cho Trống
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Đang sử dụng":
      // Màu đỏ (Rose) cho Đang sử dụng
      return "bg-rose-100 text-rose-700 border border-rose-200";
    case "Đã đặt":
      // Màu vàng hổ phách (Amber) cho Đã đặt
      return "bg-amber-100 text-amber-700 border border-amber-200";
    default:
      // Mặc định (Gray)
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

export default function TableList({ tables = [], onEdit, onDelete }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header - Sử dụng nền xám nhạt thay vì gradient để có cái nhìn phẳng và sạch hơn */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <span className="text-xl font-bold text-gray-600">
          Tổng số bàn: <strong className="text-indigo-600">{tables.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Cột Tên Bàn - Căn Trái */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                <div className="flex items-center gap-1">
                  <Info size={14} />
                  Tên Bàn
                </div>
              </th>
              {/* Cột Sức Chứa - CĂN GIỮA để cân bằng dữ liệu số */}
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                <div className="flex items-center justify-center gap-1">
                  <Users size={14} />
                  Sức Chứa
                </div>
              </th>
              {/* Cột Khu Vực - Căn Trái */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  Khu Vực
                </div>
              </th>
              {/* Cột Trạng Thái - Căn Trái */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                Trạng Thái
              </th>
              {/* Cột Thao Tác - Căn Phải */}
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                Thao Tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {tables.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-lg text-gray-500 italic"
                >
                  <p className="mb-2">🍽️</p>
                  Chưa có bàn nào được thêm. Vui lòng thêm bàn mới để quản lý.
                </td>
              </tr>
            ) : (
              tables
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-indigo-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {table.name}
                    </td>
                    {/* Sức Chứa - CĂN GIỮA */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                      {table.capacity} người
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {table.zone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center text-xs font-bold rounded-full transition ${getStatusClass(
                          table.status
                        )}`}
                      >
                        {table.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                      <button
                        onClick={() => onEdit(table)}
                        aria-label={`Sửa ${table.name}`}
                        title="Sửa thông tin bàn"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition p-2 rounded-lg hover:bg-indigo-100/50"
                      >
                        <Edit2 size={16} />
                        <span className="hidden sm:inline">Sửa</span>
                      </button>
                      <button
                        onClick={() => onDelete(table)}
                        aria-label={`Xóa ${table.name}`}
                        title="Xóa bàn khỏi danh sách"
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 transition p-2 rounded-lg hover:bg-rose-100/50"
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