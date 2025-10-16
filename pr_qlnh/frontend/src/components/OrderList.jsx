// src/components/OrderList.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";

const categories = ["Tất cả", "Đồ uống", "Món khai vị", "Món chính", "Tráng miệng", "Hải sản", "Các món chiên"];
const dishes = [
  { name: "Phở Bò", price: 55000 },
  { name: "Bún Chả", price: 45000 },
  { name: "Nem Cua Bể", price: 60000 },
  { name: "Chả Cá Lá Vọng", price: 120000 },
  { name: "Gỏi Cuốn", price: 40000 },
  { name: "Cà Phê Sữa Đá", price: 25000 },
  { name: "Nước Dừa", price: 20000 },
  { name: "Trà Chanh", price: 20000 },
];

export default function OrderList() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  return (
    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Đơn hàng mới</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Chọn Bàn
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm món ăn, đồ uống"
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full border ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dish List */}
      <div className="grid grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <div
            key={dish.name}
            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition"
          >
            <h3 className="font-semibold">{dish.name}</h3>
            <p className="text-gray-500">{dish.price.toLocaleString()}đ</p>
          </div>
        ))}
      </div>
    </div>
  );
}
