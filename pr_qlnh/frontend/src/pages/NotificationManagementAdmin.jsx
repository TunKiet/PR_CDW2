import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationList from "../components/Notification/NotificationList";
import NotificationModal from "../components/Notification/NotificationModal";
import axiosClient from "../api/axiosClient";
import { notify, confirmAction } from "../utils/notify";

export default function NotificationManagementAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axiosClient.get(`/notifications?page=${page}`);

      if (res.data?.success === false) {
        notify.error(res.data?.error || "Lỗi khi tải thông báo!");
        return;
      }

      setNotifications(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotalNotifications(res.data.total_notifications);
    } catch (err) {
      notify.error("Không thể kết nối tới server");
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
    notify.success("Lưu thông báo thành công");
    fetchNotifications(currentPage);
  };

  const handleDelete = async (item) => {
    const ok = await confirmAction("Xác nhận xóa", `Bạn có muốn xóa thông báo này?`);
    if (!ok) return;

    try {
      const res = await axiosClient.delete(`/notifications/${item.id}`);

      if (res.data?.success === false) {
        notify.error(res.data.error || "Không thể xóa thông báo");
        return;
      }

      notify.success("Xóa thành công");
      fetchNotifications(currentPage);
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

          <span className="text-sm text-gray-700">
            Tổng số thông báo: <strong>{totalNotifications}</strong>
          </span>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Tạo thông báo
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

        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchNotifications(currentPage - 1)}
            className="px-4 py-2 border rounded"
          >
            Trang trước
          </button>

          <span>
            Trang {currentPage} / {lastPage}
          </span>

          <button
            disabled={currentPage === lastPage}
            onClick={() => fetchNotifications(currentPage + 1)}
            className="px-4 py-2 border rounded"
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
