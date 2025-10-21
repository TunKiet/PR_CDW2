import React from "react";

export default function DeleteModal({ onClose, onConfirm, table }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
        <p className="text-lg">
          Bạn có chắc muốn xóa <b>{table?.name}</b> không?
        </p>
        <div className="mt-6 flex justify-center space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
