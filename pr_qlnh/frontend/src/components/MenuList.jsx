import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const MenuList = ({ onAddToCart, selectedCategory }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/menu-items");
        setMenuItems(res.data);
      } catch (err) {
        console.error("Lỗi tải menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Lọc theo danh mục + tìm kiếm
  const filteredItems = menuItems.filter((item) => {
    const matchCategory =
      selectedCategory === "Tất cả" ||
      item.category?.category_name === selectedCategory;
    const matchSearch = item.menu_item_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Khi đang tải dữ liệu
  if (loading)
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500 animate-pulse text-lg">
          Đang tải dữ liệu...
        </p>
      </div>
    );

  return (
    <div className="w-full">
      {/* 🔍 Thanh tìm kiếm */}
      <div className="relative mb-4 w-full">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm món ăn, đồ uống..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
        />
      </div>

      {/* 🍽️ Danh sách món */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.menu_item_id}
              onClick={() => onAddToCart(item)}
              className="bg-white hover:bg-indigo-50 cursor-pointer rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-indigo-400 transition"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.menu_item_name}
                  className="rounded-xl mb-2 w-full h-32 object-cover"
                />
              )}
              <h3 className="font-semibold text-gray-800 truncate">
                {item.menu_item_name}
              </h3>
              <p className="text-indigo-600 font-medium mt-1">
                {item.price.toLocaleString()}đ
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full py-8">
            Không tìm thấy món nào phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuList;
