import React, { useState } from "react";
import { X, Wallet, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import axiosClient from "../api/axiosClient"; // ✅ Thêm dòng này

const PaymentModal = ({ isOpen, onClose, orderItems = [], customer, onCompletePayment }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  // ✅ Hiển thị toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Tính tổng tiền
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + tax - discount;

  // ✅ Thanh toán hoàn tất
  const handleCompletePayment = async () => {
    setLoading(true);
    try {
      const orderData = {
        customer_id: customer?.customer_id || null,
        items: orderItems.map(i => ({
          menu_item_id: i.menu_item_id,
          quantity: i.qty,
        })),
      };

      const orderRes = await axiosClient.post("/orders", orderData);
      const orderId = orderRes.data.data.order_id;

      await axiosClient.post("/payments", {
        order_id: orderId,
        payment_method: paymentMethod,
        amount: total,
      });

      showToast("success", "Thanh toán thành công!");
      setShowSuccess(true);
      if (onCompletePayment) onCompletePayment(orderRes.data);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      showToast("error", "Lỗi khi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-xl shadow-lg text-white z-[999999] transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {toast.type === "success" ? <CheckCircle size={20} /> : "⚠️"}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Popup thành công */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[99999]">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center animate-bounce">
            <CheckCircle className="text-green-500" size={60} />
            <p className="text-xl font-bold mt-2 text-green-600">
              Thanh toán thành công!
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[99999]">
          <div className="bg-white px-6 py-4 rounded-xl shadow text-gray-700 font-medium">
            Đang xử lý thanh toán...
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999]">
        <div className="bg-white rounded-2xl shadow-xl w-[850px] max-h-[90vh] overflow-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Xác nhận thanh toán</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* LEFT */}
            <div>
              {orderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-3 shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold">{item.menu_item_name}</h4>
                    <p className="text-gray-500 text-sm">
                      {item.price.toLocaleString()}đ x {item.qty}
                    </p>
                  </div>
                  <div className="font-semibold">
                    {(item.price * item.qty).toLocaleString()}đ
                  </div>
                </div>
              ))}

              <div className="mt-4 space-y-1 text-gray-700">
                <div className="flex justify-between">
                  <span>Tổng tiền</span>
                  <b>{subtotal.toLocaleString()}đ</b>
                </div>
                <div className="flex justify-between">
                  <span>Thuế 10%</span>
                  <b>{tax.toLocaleString()}đ</b>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Thành tiền</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>

              {customer ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm mb-4">
                  <p><b>{customer.customer_name}</b></p>
                  <p className="text-gray-600">📞 {customer.phone}</p>
                  <p className="text-yellow-600 font-semibold">
                    ⭐ Điểm tích luỹ: {customer.points ?? 0}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm mb-4">
                  <p className="text-gray-700">Không có thông tin khách hàng.</p>
                </div>
              )}

              <h2 className="text-lg font-semibold mb-3">Phương thức thanh toán</h2>

              {[
                { id: "cash", label: "Tiền mặt", icon: <DollarSign /> },
                { id: "card", label: "Thẻ ngân hàng", icon: <CreditCard /> },
                { id: "wallet", label: "Ví điện tử", icon: <Wallet /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl shadow-sm border mb-2 ${
                    paymentMethod === m.id
                      ? "bg-indigo-50 border-indigo-600"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {m.icon}
                  <span className="font-medium">{m.label}</span>
                </button>
              ))}

              <button
                onClick={handleCompletePayment}
                disabled={loading}
                className="w-full bg-green-500 text-white font-semibold py-4 rounded-xl mt-4 hover:bg-green-600 shadow"
              >
                {loading ? "Đang xử lý..." : "Hoàn tất thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
