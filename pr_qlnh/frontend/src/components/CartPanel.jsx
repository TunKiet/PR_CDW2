// src/components/CartPanel.jsx
import React from "react";
import { Search } from "lucide-react";

export default function CartPanel() {
  return (
    <div className="w-96 bg-white p-6 rounded-2xl shadow-sm flex flex-col">
      <h2 className="text-xl font-bold mb-2">Đơn hàng</h2>
      <p className="text-gray-500 mb-4">
        Bàn: <span className="font-semibold text-gray-800">Chưa chọn</span>
      </p>

      {/* Tìm khách hàng */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Nhập SĐT khách hàng"
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-400 italic">
        Chưa có món nào trong đơn hàng.
      </div>

      {/* Tính tiền */}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Tổng cộng</span>
          <span>0đ</span>
        </div>
        <div className="flex justify-between">
          <span>Giảm giá</span>
          <span>0đ</span>
        </div>
        <div className="flex justify-between font-semibold text-blue-600">
          <span>Thành tiền</span>
          <span>0đ</span>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="mt-4">
        <label className="block text-sm text-gray-700 mb-1">Ghi chú:</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300"
          placeholder="Ví dụ: không cay, không hành..."
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="mt-4 space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
          Gửi đơn đến Bếp
        </button>
        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg">
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
}
