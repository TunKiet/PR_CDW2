import React from 'react';

export default function DeleteModal({ isOpen, onClose, onConfirm, tableName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Xác Nhận Xóa Bàn</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            Bạn có chắc chắn muốn xóa bàn <strong>{tableName}</strong> không?
          </p>
          <p className="text-sm text-red-500 mt-2">Thao tác này không thể hoàn tác.</p>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg">Xóa Bàn</button>
        </div>
      </div>
    </div>
  );
}
