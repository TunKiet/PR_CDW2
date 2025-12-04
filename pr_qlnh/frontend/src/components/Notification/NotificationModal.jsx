import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { notify } from "../../utils/notify";

export default function NotificationModal({ isOpen, onClose, editing, onSaved }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setMessage(editing.message);
    } else {
      setTitle("");
      setMessage("");
    }
  }, [editing]);

  const handleSubmit = async () => {
    try {
      const payload = { title, message };

      let res;
      if (editing) {
        res = await axiosClient.put(`/notifications/${editing.id}`, payload);
      } else {
        res = await axiosClient.post(`/notifications`, payload);
      }

      if (res.data?.success === false) {
        notify.error(res.data.error || "Lỗi khi lưu");
        return;
      }

      onSaved();
      onClose();
    } catch (err) {
      notify.error("Lỗi kết nối server");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[450px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
        </h2>

        <label className="block mb-3">
          Tiêu đề:
          <input
            className="w-full p-2 border rounded mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          Nội dung:
          <textarea
            className="w-full p-2 border rounded mt-1"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Hủy
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
