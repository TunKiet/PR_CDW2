import React from "react";
import { XCircle } from "lucide-react";

export default function NotificationCenter({
  unreadCount,
  notifications,
  open,
  onToggle,
  onMarkRead,
  onSelect,
}) {
  return (
    <div className="relative">
      {/* Icon nút mở */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-800">Thông báo mới</h4>
            <button
              onClick={onMarkRead}
              className="text-xs text-indigo-500 hover:text-indigo-600"
            >
              Đánh dấu đã đọc
            </button>
          </div>

          <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 && (
              <li className="p-4 text-sm text-gray-500 italic">Không có thông báo</li>
            )}
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition ${
                  !n.read ? "bg-yellow-50" : ""
                }`}
                onClick={() => onSelect(n)}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  !
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      !n.read ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500">{n.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-2 text-center border-t border-gray-100">
            <button className="text-sm text-indigo-500 hover:text-indigo-600">
              Xem tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
