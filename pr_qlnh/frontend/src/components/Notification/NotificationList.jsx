import React from "react";

export default function NotificationList({ notifications, onEdit, onDelete }) {
  const typeIcon = {
    system: "🔔",
    order: "🧾",
    kitchen: "🍳",
    promotion: "🎉",
    warning: "⚠️",
    info: "ℹ️",
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    normal: "bg-gray-100 text-gray-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="p-3 text-left">Loại</th>
            <th className="p-3 text-left">Tiêu đề</th>
            <th className="p-3 text-left">Mức ưu tiên</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-center w-24">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {notifications?.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                Không có thông báo nào
              </td>
            </tr>
          )}

          {notifications?.map((item) => (
            <tr
              key={item.notification_id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 flex items-center gap-2">
                <span className="text-lg">{typeIcon[item.type] || "🔔"}</span>
                <span className="capitalize">{item.type}</span>
              </td>

              <td className="p-3">
                <div className="font-medium">{item.title}</div>
                <div className="text-gray-500 text-sm line-clamp-1">
                  {item.message}
                </div>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${priorityColor[item.priority]}`}
                >
                  {item.priority.toUpperCase()}
                </span>
              </td>

              <td className="p-3 text-gray-600">
                {new Date(item.created_at).toLocaleString("vi-VN")}
              </td>

              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
