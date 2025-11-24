import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MenuList from "../components/MenuList";
import OrderSummary from "../components/OrderSummary";
import TableModal from "../components/TableModal";

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleAddToCart = (item) => {
    const existing = cartItems.find((i) => i.menu_item_id === item.menu_item_id);
    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i.menu_item_id === item.menu_item_id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };
  const handleRemoveItem = (id) => {
  setCartItems((prev) => prev.filter((item) => item.menu_item_id !== id));
};


  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 flex gap-6">
        {/* Khu vực menu món */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold text-gray-800">Đơn hàng mới</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              {selectedTable ? selectedTable.table_name : "Chọn Bàn"}
            </button>
          </div>

          {/* Tabs danh mục */}
          <div className="flex flex-wrap gap-3 mb-6 pb-5">
            {["Tất cả", "Đồ uống", "Món khai vị", "Món chính", "Tráng miệng", "Hải sản", "Các món chiên"].map(
              (category, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          <MenuList
            onAddToCart={handleAddToCart}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Cột thanh toán */}
        <OrderSummary
  cartItems={cartItems}
  table={selectedTable}
  onRemoveItem={handleRemoveItem}
/>

      </div>

      {/* Modal chọn bàn */}
      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTable={setSelectedTable}
      />
    </div>
  );
};

export default OrderPage;
