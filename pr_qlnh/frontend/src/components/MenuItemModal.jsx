import React from "react";

export default function MenuItemModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-xl font-bold absolute right-5 top-3"
        >
          &times;
        </button>

        {/* Image */}
        <img
          src={item.image_url}
          alt={item.menu_item_name}
          className="rounded-xl mb-4 w-full h-48 object-cover"
        />

        {/* Name */}
        <h2 className="text-xl font-bold mb-2">{item.menu_item_name}</h2>

        {/* Price */}
        <p className="text-indigo-600 font-semibold text-lg mb-2">
          {new Intl.NumberFormat("vi-VN").format(item.price)}đ
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {item.description || "Món ăn này chưa có mô tả chi tiết."}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
          >
            ➕ Thêm vào giỏ hàng
          </button>

          <button
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition"
            onClick={() =>
              (window.location.href = `/menu-item/${item.menu_item_id}`)
            }
          >
            Xem chi tiết →
          </button>
        </div>
      </div>
    </div>
  );
}
