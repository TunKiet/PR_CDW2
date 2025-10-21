import React, { useState, useEffect } from "react";

export default function TableModal({ onClose, onSave, table }) {
  const [form, setForm] = useState({ name: "", capacity: "", zone: "", status: "Trống" });

  useEffect(() => {
    if (table) setForm(table);
  }, [table]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || form.capacity < 1 || !form.zone) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {table ? "Sửa thông tin bàn" : "Thêm bàn mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tên bàn"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Sức chứa"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Khu vực"
            value={form.zone}
            onChange={(e) => setForm({ ...form, zone: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />

          {table && (
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option>Trống</option>
              <option>Đã đặt</option>
              <option>Đang sử dụng</option>
            </select>
          )}

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Hủy hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              {table ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
