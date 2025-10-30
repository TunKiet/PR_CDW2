// src/components/PaymentModal.jsx
import React, { useState } from "react";
import { X, Wallet, CreditCard, DollarSign } from "lucide-react";

const PaymentModal = ({ isOpen, onClose, orderItems = [] }) => {
  const [voucher, setVoucher] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  if (!isOpen) return null;

  // ❗Demo data tính toán
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + tax - discount;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999]">

      <div className="bg-white rounded-2xl shadow-xl w-[850px] max-h-[90vh] overflow-auto p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">

          {/* Left: Order Items */}
          <div>
            {orderItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-3 shadow-sm">
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.price.toLocaleString()}đ x {item.qty}</p>
                </div>
                <div className="font-semibold">{(item.price * item.qty).toLocaleString()}đ</div>
              </div>
            ))}

            {/* Voucher */}
            <div className="border-t mt-4 pt-4">
              <p className="font-semibold mb-2">Mã Ưu Đãi (Voucher Code):</p>
              <div className="flex gap-2">
                <input
                  className="w-full border rounded-xl px-4 py-2 focus:outline-indigo-500"
                  placeholder="Nhập mã ưu đãi..."
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <button className="bg-indigo-600 text-white px-5 rounded-xl shadow hover:bg-indigo-700">
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-4 space-y-1 text-gray-700">
              <div className="flex justify-between"><span>Tổng phụ</span><b>{subtotal.toLocaleString()}đ</b></div>
              <div className="flex justify-between"><span>Giảm giá Voucher</span><b className="text-red-500">{discount}đ</b></div>
              <div className="flex justify-between"><span>Thuế (VAT 10%)</span><b>{tax.toLocaleString()}đ</b></div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                <span>Thành tiền</span><span>{total.toLocaleString()}đ</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Method */}
          <div>
            <h2 className="text-xl font-bold mb-4">Chọn phương thức thanh toán</h2>

            {/* List Method */}
            <div className="space-y-3">
              {[
                { id: "cash", label: "Tiền mặt", icon: <DollarSign /> },
                { id: "card", label: "Thẻ", icon: <CreditCard /> },
                { id: "wallet", label: "Ví điện tử", icon: <Wallet /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl shadow-sm border
                    ${paymentMethod === m.id ? "bg-indigo-50 border-indigo-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}
                  `}
                >
                  {m.icon}
                  <span className="font-medium">{m.label}</span>
                </button>
              ))}

              {/* Pay button */}
              <button className="w-full bg-green-500 text-white font-semibold py-4 rounded-xl mt-4 hover:bg-green-600 shadow">
                Hoàn tất thanh toán
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
