import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TableList({ tables, onEdit, onDelete }) {
  // Hàm lấy style trạng thái: Màu sắc hiện đại, tương phản nhẹ nhàng
  const getStatusStyle = (status) => {
    switch (status) {
      case "Trống":
        // Màu Xanh lá (Success)
        return "bg-green-100 text-green-700 border-green-300 font-semibold";
      case "Đang sử dụng":
        // Màu Đỏ/Hồng (Danger)
        return "bg-red-100 text-red-700 border-red-300 font-semibold";
      case "Đã đặt":
        // Màu Vàng/Cam (Warning)
        return "bg-yellow-100 text-yellow-700 border-yellow-300 font-semibold";
      default:
        // Mặc định
        return "bg-gray-100 text-gray-600 border-gray-300 font-medium";
    }
  };

  // Hiển thị thông báo khi không có bàn
  if (!tables || tables.length === 0)
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <p className="text-gray-700 text-xl font-semibold mt-4">
          Không tìm thấy bàn nào.
        </p>
        <p className="text-gray-500 text-md mt-1">
          Hãy thêm bàn mới để quản lý hoạt động nhà hàng của bạn.
        </p>
        {/* Có thể thêm nút Thêm bàn tại đây */}
      </div>
    );

  // Giao diện bảng
  return (
    <div className="overflow-hidden shadow-2xl rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm">
      {/* Header của component */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-white to-blue-50">
        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
          <span className="text-blue-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 14v6m-3-3h6m-3-12v6m-9-3h6m-6 0a3 3 0 110-6 3 3 0 010 6zm10 0a3 3 0 110-6 3 3 0 010 6zm-10 6a3 3 0 110-6 3 3 0 010 6zm10 0a3 3 0 110-6 3 3 0 010 6z"
              ></path>
            </svg>
          </span>
          Quản Lý Danh Sách Bàn
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header Bảng */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Tên Bàn
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Sức Chứa
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Khu Vực
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>

          {/* Body Bảng */}
          <tbody className="divide-y divide-gray-100">
            {tables.map((t, index) => (
              <tr
                key={t.id}
                // Dùng màu nền nhạt hơn và hiệu ứng hover nổi bật
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50/70 transition-all duration-300`}
              >
                <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">
                  {t.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{t.capacity} người</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{t.zone}</td>
                <td className="px-6 py-4">
                  {/* Badge trạng thái được làm lớn hơn, bo tròn và nổi bật */}
                  <span
                    className={`inline-flex items-center px-3.5 py-1.5 text-xs rounded-full border shadow-sm ${getStatusStyle(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    {/* Nút Sửa: Tông màu xanh dương thanh lịch */}
                    <button
                      onClick={() => onEdit(t)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Chỉnh sửa thông tin bàn"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Sửa
                    </button>
                    {/* Nút Xóa: Tông màu đỏ cam nổi bật cảnh báo */}
                    <button
                      onClick={() => onDelete(t)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Xóa bàn khỏi danh sách"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}