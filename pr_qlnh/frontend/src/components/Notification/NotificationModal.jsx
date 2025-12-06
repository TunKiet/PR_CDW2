import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { notify } from "../../utils/notify";

export default function NotificationModal({ isOpen, onClose, editing, onSaved }) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "system",
    priority: "normal",
    scope: "all",
    user_id: "",
    role: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        message: editing.message || "",
        type: editing.type || "system",
        priority: editing.priority || "normal",
        scope: editing.scope || "all",
        user_id: editing.user_id || "",
        role: editing.role || "",
      });
    } else {
      setForm({
        title: "",
        message: "",
        type: "system",
        priority: "normal",
        scope: "all",
        user_id: "",
        role: "",
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axiosClient.put(`/notifications/${editing.notification_id}`, form);
        notify.success("Cập nhật thông báo thành công");
      } else {
        await axiosClient.post("/notifications", form);
        notify.success("Tạo thông báo thành công");
      }

      onSaved();
      onClose();
    } catch (err) {
      notify.error("Lỗi khi lưu thông báo");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Chỉnh sửa Thông báo" : "Tạo Thông báo mới"}
        </h2>

        {/* TITLE */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Nội dung</label>
          <textarea
            name="message"
            rows="3"
            value={form.message}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* TYPE + PRIORITY */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Loại</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="system">System</option>
              <option value="order">Order</option>
              <option value="kitchen">Kitchen</option>
              <option value="promotion">Promotion</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium">Ưu tiên</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="low">Thấp</option>
              <option value="normal">Bình thường</option>
              <option value="high">Cao</option>
            </select>
          </div>
        </div>

        {/* SCOPE */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Phạm vi gửi</label>
          <select
            name="scope"
            value={form.scope}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="all">Gửi toàn hệ thống</option>
            <option value="user">Gửi 1 người dùng</option>
            <option value="role">Gửi theo vai trò</option>
          </select>
        </div>

        {/* USER / ROLE FIELD */}
        {form.scope === "user" && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">User ID</label>
            <input
              type="number"
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        {form.scope === "role" && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">Vai trò</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {editing ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
