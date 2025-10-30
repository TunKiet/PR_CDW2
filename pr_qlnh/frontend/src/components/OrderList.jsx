import React from "react";

export default function OrderList({ menuItems, addItem, setShowModal }) {
  return (
    <div className="flex-1 flex flex-col p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Đơn hàng mới</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Chọn Bàn
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn, đồ uống"
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8A4 4 0 008 4zM2 8a6 6 0 1110.89 3.535l4.636 4.636a1 1 0 01-1.414 1.414L11.475 13.05A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Danh sách món */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pb-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => addItem(item)}
            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {item.price.toLocaleString()}đ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
