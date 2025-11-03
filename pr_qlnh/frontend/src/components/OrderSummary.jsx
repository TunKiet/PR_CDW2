import React, { useState } from "react";
import PaymentModal from "./PaymentModal";

const OrderSummary = ({ cartItems, onRemoveItem, table }) => {
  const [openPayment, setOpenPayment] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div className="w-96 bg-white rounded-2xl shadow-lg border p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đơn hàng</h2>
          <span className="text-gray-600 text-sm">
            Bàn: <b>{table ? table.table_name : "Chưa chọn"}</b>
          </span>
        </div>

        {/* Nhập số điện thoại */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            SĐT Thành viên:
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              placeholder="Nhập SĐT khách hàng"
              className="flex-1 border rounded-l-md p-2 text-sm focus:ring-1 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white px-3 rounded-r-md">
              🔍
            </button>
          </div>
        </div>

        {/* Danh sách món */}
        <div className="mb-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              Chưa có món nào trong đơn hàng.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.menu_item_id}
                className="flex justify-between items-center mb-2 border-b pb-1"
              >
                <span>
                  {item.menu_item_name} x{item.qty}
                </span>
                <span className="text-gray-700">
                  {(item.price * item.qty).toLocaleString()}đ
                </span>
              </div>
            ))
          )}
        </div>

        {/* Tổng tiền */}
        <div className="border-t pt-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Giảm giá</span>
            <span>0đ</span>
          </div>
          <div className="flex justify-between font-bold text-indigo-600 text-base mt-2">
            <span>Thành tiền</span>
            <span>{total.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Ghi chú */}
        <textarea
          className="mt-3 border rounded-md p-2 text-sm resize-none"
          rows="3"
          placeholder="Ví dụ: không cay, không hành..."
        ></textarea>

        {/* Nút hành động */}
        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium">
          Gửi đơn đến Bếp
        </button>

        <button
          className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
          onClick={() => setOpenPayment(true)}
        >
          Thanh toán ngay
        </button>
      </div>

      {/* Modal thanh toán */}
      <PaymentModal
        isOpen={openPayment}
        onClose={() => setOpenPayment(false)}
        orderItems={cartItems}
      />
    </>
  );
};

export default OrderSummary;
