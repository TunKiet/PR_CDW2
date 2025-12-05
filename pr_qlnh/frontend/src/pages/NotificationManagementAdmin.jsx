import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosClient from "../api/axiosClient";
import NotificationList from "../components/Notification/NotificationList";
import NotificationModal from "../components/Notification/NotificationModal";
import { notify, confirmAction } from "../utils/notify";

export default function NotificationManagementAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axiosClient.get(`/notifications?page=${page}`);

      if (!res.data.success) return;

      const pg = res.data.data;

      setNotifications(pg.data);
      setCurrentPage(pg.current_page);
      setLastPage(pg.last_page);
    } catch (err) {
      notify.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSaved = () => {

    // REFRESH LIST
    fetchNotifications(currentPage);

    // ⭐ TRIGGER CHO CHUÔNG BIẾT CÓ THÔNG BÁO MỚI
    window.dispatchEvent(new Event("notification-updated"));

    notify.success("Lưu thông báo thành công");
  };

  const handleDelete = async (item) => {
    const ok = await confirmAction("Xác nhận xóa", "Bạn có chắc muốn xóa?");
    if (!ok) return;

    try {
      await axiosClient.delete(`/notifications/${item.notification_id}`);
      notify.success("Đã xóa");

      fetchNotifications(currentPage);

      // ⭐ CHUÔNG NHẬN UPDATE NGAY LẬP TỨC
      window.dispatchEvent(new Event("notification-updated"));

    } catch (err) {
      notify.error("Lỗi khi xóa thông báo");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Quản lý Thông báo</h2>

          <button
            onClick={openCreate}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            + Tạo thông báo
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6">Đang tải...</div>
        ) : (
          <NotificationList
            notifications={notifications}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchNotifications(currentPage - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Trang trước
          </button>

          <span className="text-sm text-gray-600">
            Trang {currentPage} / {lastPage}
          </span>

          <button
            disabled={currentPage === lastPage}
            onClick={() => fetchNotifications(currentPage + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Trang sau
          </button>
        </div>

        <NotificationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          editing={editing}
          onSaved={handleSaved}
        />
      </main>
    </div>
  );
}
