import React from "react";

export default function CartPanel({
  orderItems,
  removeItem,
  subtotal,
  selectedTable,
  memberPhone,
  setMemberPhone,
  memberFound,
  lookupMember,
}) {
  return (
    <div className="w-96 bg-white p-6 rounded-xl shadow-lg flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đơn hàng</h2>
        <span className="text-gray-500">
          Bàn: <span className="font-semibold">{selectedTable}</span>
        </span>
      </div>

      {/* SĐT Thành viên */}
      <div className="mb-4 pt-2 border-t border-gray-100">
        <label className="block text-sm font-medium mb-1">
          SĐT Thành viên (Tích điểm):
        </label>
        <div className="relative">
          <input
            type="tel"
            value={memberPhone}
            onChange={(e) => setMemberPhone(e.target.value)}
            className="w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập SĐT khách hàng"
          />
          <button
            onClick={lookupMember}
            className="absolute right-0 top-0 h-full px-2 text-blue-600"
          >
            🔍
          </button>
        </div>
        {memberFound === false && (
          <p className="text-xs mt-1 text-gray-500 italic">
            Chưa tìm thấy thành viên.
          </p>
        )}
        {memberFound && (
          <p className="text-xs mt-1 text-green-600 italic">
            {memberFound.name} ({memberFound.rank})
          </p>
        )}
      </div>

      {/* Danh sách món */}
      <div className="space-y-4 mb-6 flex-grow overflow-y-auto">
        {Object.keys(orderItems).length === 0 ? (
          <div className="text-center text-gray-500 py-4 italic">
            Chưa có món nào trong đơn hàng.
          </div>
        ) : (
          Object.values(orderItems).map((item) => (
            <div key={item.name} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price.toLocaleString()}đ x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.name)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>

      {/* Tổng cộng */}
      <div className="border-t border-gray-200 pt-6 space-y-2">
        <div className="flex justify-between">
          <span>Tổng cộng</span>
          <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-blue-600">
          <span>Thành tiền</span>
          <span>{subtotal.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Ghi chú:</label>
        <textarea
          rows="3"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ví dụ: không cay, không hành..."
        ></textarea>
      </div>

      <div className="mt-6 space-y-3">
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          Gửi đơn đến Bếp
        </button>
        <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
}
