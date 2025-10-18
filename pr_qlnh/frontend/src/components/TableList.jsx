import React from "react";

export default function TableList({ tables, onEdit, onDelete }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Trống":
        return "bg-emerald-100 text-emerald-800";
      case "Đang sử dụng":
        return "bg-red-100 text-red-800";
      case "Đã đặt":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!tables.length)
    return <p className="text-gray-500 text-center mt-10">Chưa có bàn nào.</p>;

  return (
    <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
      <thead className="bg-gray-100 text-gray-700 text-sm">
        <tr>
          <th className="px-6 py-3 text-left">Tên bàn</th>
          <th className="px-6 py-3 text-left">Sức chứa</th>
          <th className="px-6 py-3 text-left">Khu vực</th>
          <th className="px-6 py-3 text-left">Trạng thái</th>
          <th className="px-6 py-3 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((t) => (
          <tr key={t.id} className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-semibold">{t.name}</td>
            <td className="px-6 py-4">{t.capacity} người</td>
            <td className="px-6 py-4">{t.zone}</td>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                  t.status
                )}`}
              >
                {t.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right space-x-2">
              <button
                onClick={() => onEdit(t)}
                className="text-indigo-600 hover:text-indigo-900 p-1"
              >
                Sửa
              </button>
              <button
                onClick={() => onDelete(t)}
                className="text-red-600 hover:text-red-900 p-1"
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
