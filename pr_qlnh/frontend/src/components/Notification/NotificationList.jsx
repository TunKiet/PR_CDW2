import React from "react";

export default function NotificationList({ notifications, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-3">ID</th>
            <th className="p-3">Tiêu đề</th>
            <th className="p-3">Nội dung</th>
            <th className="p-3">Ngày tạo</th>
            <th className="p-3 text-center w-32">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {notifications.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.id}</td>
              <td className="p-3 font-semibold">{item.title}</td>
              <td className="p-3">{item.message}</td>
              <td className="p-3">{item.created_at}</td>
              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => onDelete(item)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {notifications.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Không có thông báo nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
