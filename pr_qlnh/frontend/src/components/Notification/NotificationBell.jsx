import React, { useEffect, useState, useRef } from "react";
import axiosClient from "../../api/axiosClient";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // Modal
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Floating bell position
  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem("bell-pos");
    return saved ? JSON.parse(saved) : { top: 20, right: 20 };
  });

  const bellRef = useRef(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const fetchNotifications = async () => {
    try {
      const res = await axiosClient.get("/notifications", {
        params: { user_id: userId },
      });
      if (res.data.success) {
        setNotifications(res.data.data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
  const updateHandler = () => {
    fetchNotifications();
  };

  window.addEventListener("notification-updated", updateHandler);

  return () => {
    window.removeEventListener("notification-updated", updateHandler);
  };
}, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const typeEmoji = {
    system: "🔔",
    order: "🧾",
    kitchen: "🍳",
    promotion: "🎉",
    warning: "⚠️",
    info: "ℹ️",
  };

  const markRead = async (id) => {
    await axiosClient.post(`/notifications/${id}/mark-read`, { user_id: userId });
    fetchNotifications();
    setOpen(false);
  };

  const markAllRead = async () => {
    await axiosClient.post(`/notifications/mark-all-read`, { user_id: userId });
    fetchNotifications();
    setOpen(false);
  };

  // -------- DRAG HANDLERS WITH SCREEN LIMIT ----------
  const startDrag = (e) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX, y: e.clientY };
  };

  const onDrag = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - dragOffset.current.x;
    const dy = e.clientY - dragOffset.current.y;

    dragOffset.current = { x: e.clientX, y: e.clientY };

    setPos((prev) => {
      const newPos = {
        top: Math.max(10, Math.min(window.innerHeight - 80, prev.top + dy)),
        right: Math.max(10, Math.min(window.innerWidth - 80, prev.right - dx)),
      };
      localStorage.setItem("bell-pos", JSON.stringify(newPos));
      return newPos;
    });
  };

  const stopDrag = () => (dragging.current = false);

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  // ----------------- RENDER -----------------
  return (
    <>
      {/* 🔔 Floating Bell */}
      <div
        className="fixed z-[9999]"
        style={{ top: pos.top, right: pos.right }}
      >
        <button
          onMouseDown={startDrag}
          onClick={() => setOpen(!open)}
          className="w-10 h-10 flex items-center justify-center bg-white shadow-lg rounded-full hover:bg-gray-100 relative cursor-grab"
            style={{
                borderRadius: "50%",      // ép bo tròn tuyệt đối
                overflow: "hidden",       // bắt layout con phải tròn
                WebkitBorderRadius: "50%",// chống safari lỗi bo tròn
            }}
        >
          <span className="text-xl">🔔</span>

          
        </button>

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        {/* Mini Panel */}
        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200">
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="font-bold text-sm">Thông báo</h4>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-indigo-500 hover:underline"
                >
                  Đọc hết
                </button>
              )}
            </div>

            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 text-sm">
              {notifications.length === 0 ? (
                <li className="p-4 text-center text-gray-500 text-sm">
                  Không có thông báo
                </li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.notification_id}
                    onClick={() => {
                      markRead(n.notification_id);
                      setSelectedNotification(n);
                    }}
                    className={`p-3 cursor-pointer flex gap-3 ${
                      !n.is_read ? "bg-yellow-50 border-l-4 border-yellow-400" : ""
                    }`}
                  >
                    <span className="text-xl">{typeEmoji[n.type]}</span>
                    <div>
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-gray-500 text-xs line-clamp-1">
                        {n.message}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(n.created_at).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div className="p-2 text-center border-t">
              <button
                onClick={() => {
                  setOpen(false);
                  setShowAllModal(true);
                }}
                className="text-sm text-indigo-600 hover:underline"
              >
                Xem tất cả
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 📌 Modal Xem tất cả */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[99999]">
          <div className="bg-white w-[450px] max-h-[80vh] p-4 rounded-lg shadow-xl overflow-y-auto">
            <h3 className="font-bold text-lg mb-3">Tất cả thông báo</h3>

            {notifications.map((n) => (
              <div
                key={n.notification_id}
                onClick={() => setSelectedNotification(n)}
                className="p-3 mb-2 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeEmoji[n.type]}</span>
                  <div>
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-1">
                      {n.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAllModal(false)}
              className="mt-3 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* 📌 Modal Chi tiết 1 thông báo */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[99999]">
          <div className="bg-white w-[400px] p-5 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-2">
              {selectedNotification.title}
            </h3>

            <p className="text-gray-700 mb-4">{selectedNotification.message}</p>

            <p className="text-xs text-gray-500">
              Thời gian:{" "}
              {new Date(selectedNotification.created_at).toLocaleString("vi-VN")}
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
