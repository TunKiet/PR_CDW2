import React from "react";
import axiosClient from "../../api/axiosClient";

export default function DeleteModal({ isOpen, onClose, table, onDeleted }) {
  if (!isOpen || !table) return null;

  const handleConfirm = async () => {
    try {
      await axiosClient.delete(`/tables/${table.table_id}`);
      onDeleted && onDeleted(table);
      onClose();
    } catch (err) {
      alert("Xóa thất bại: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
        </div>
        <div className="p-4">
          <p>Bạn có chắc chắn muốn xóa bàn <strong>{table.table_name}</strong> không?</p>
          <p className="text-sm text-red-500 mt-2">Hành động này không thể hoàn tác.</p>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Xóa</button>
        </div>
      </div>
    </div>
  );
}
