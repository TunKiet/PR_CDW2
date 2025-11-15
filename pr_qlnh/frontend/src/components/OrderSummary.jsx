import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import axiosClient from "../api/axiosClient";

const OrderSummary = ({ cartItems, table, onRemoveItem }) => {
  const [openPayment, setOpenPayment] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [note, setNote] = useState(""); // 🆕 Ghi chú
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🔍 Tìm khách hàng theo SĐT
  const handleSearchCustomer = async () => {
    if (!customerPhone.trim()) {
      setSearchMessage("⚠️ Vui lòng nhập số điện thoại!");
      return;
    }
    try {
      const res = await axiosClient.get(`/customers/search?phone=${customerPhone}`);
      if (res.data) {
        setCustomer(res.data);
        setSearchMessage(`✅ Khách hàng: ${res.data.customer_name}`);
      } else {
        setCustomer(null);
        setSearchMessage("❌ Không tìm thấy khách hàng!");
      }
    } catch (err) {
      console.error(err);
      setCustomer(null);
      setSearchMessage("❌ Lỗi khi tìm khách hàng!");
    }
  };

  // ✅ Khi thanh toán xong
  const handlePaymentComplete = (order) => {
    localStorage.setItem("lastOrder", JSON.stringify(order));
    navigate("/order-management");
  };

  return (
    <>
      <div className="w-96 bg-white rounded-2xl shadow-lg border p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đơn hàng</h2>
          <span className="text-gray-600 text-sm">
            Bàn: <b>{table ? table.table_name : "Chưa chọn"}</b>
          </span>
        </div>

        {/* Nhập SĐT khách hàng */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            SĐT Thành viên:
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              placeholder="Nhập SĐT khách hàng"
              className="flex-1 border rounded-l-md p-2 text-sm focus:ring-1 focus:ring-indigo-500"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <button
              onClick={handleSearchCustomer}
              className="bg-indigo-600 text-white px-3 rounded-r-md"
            >
              🔍
            </button>
          </div>

          {/* ✅ Hiển thị thông tin khách hàng */}
          {customer ? (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
              <p><b>{customer.customer_name}</b></p>
              <p className="text-gray-600">📞 {customer.name}</p>
              <p className="text-yellow-600 font-semibold">
                ⭐ Điểm tích luỹ: {customer.points}
              </p>
            </div>
          ) : (
            searchMessage && (
              <p className="text-xs text-gray-500 mt-2">{searchMessage}</p>
            )
          )}
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
                <span>{item.menu_item_name} x{item.qty}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">
                    {(item.price * item.qty).toLocaleString()}đ
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.menu_item_id)}
                    className="text-red-500 hover:text-red-700 font-bold text-sm"
                  >
                    🗑
                  </button>
                </div>
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
          <div className="flex justify-between font-bold text-indigo-600 text-base mt-2">
            <span>Thành tiền</span>
            <span>{total.toLocaleString()}đ</span>
          </div>
        </div>

        {/* 📝 Ô ghi chú */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú:
          </label>
          <textarea
            placeholder="Ví dụ: không cay, không hành..."
            className="w-full border rounded-lg p-2 text-sm focus:ring-1 focus:ring-indigo-500 resize-none"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Nút thanh toán */}
        <button
          className={`mt-4 ${
            cartItems.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } py-2 rounded-lg font-medium`}
          onClick={() => setOpenPayment(true)}
          disabled={cartItems.length === 0}
        >
          Thanh toán ngay
        </button>
      </div>

      {/* Modal thanh toán */}
      <PaymentModal
        isOpen={openPayment}
        onClose={() => setOpenPayment(false)}
        orderItems={cartItems}
        
        onCompletePayment={handlePaymentComplete}
        customer={customer}
        note={note} // 🆕 Truyền ghi chú sang PaymentModal
      />
    </>
  );
};

export default OrderSummary;
