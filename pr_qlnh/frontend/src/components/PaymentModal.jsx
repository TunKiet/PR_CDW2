import React, { useState } from "react";
import { X, Wallet, CreditCard, DollarSign, CheckCircle, Tag } from "lucide-react";
import axiosClient from "../api/axiosClient";

const PaymentModal = ({
  isOpen,
  onClose,
  orderItems = [],
  customer,
  note,
  tableId,        
  tableName,      
  onCompletePayment,
}) => {

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Format tiền
  const formatCurrency = (number) => {
    return Number(number).toLocaleString("vi-VN") + "đ";
  };

  if (!isOpen) return null;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // 🎖️ Rank + % giảm giá theo Rank
  const getRankDiscount = (points) => {
    if (points >= 50000) {
      return { rank: "Kim Cương", percent: 10 };
    } else if (points >= 15000) {
      return { rank: "Vàng", percent: 5 };
    } else if (points >= 5000) {
      return { rank: "Bạc", percent: 3 };
    } else {
      return { rank: "Đồng", percent: 0 };
    }
  };

  // 🧮 Tính tổng tiền hàng
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  // Rank discount
  const rankInfo = getRankDiscount(customer?.points || 0);
  const rankDiscount = (subtotal * rankInfo.percent) / 100;

  // Tổng cuối
  const total = subtotal - discount - rankDiscount;

  // 🏷️ Áp dụng voucher
  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      showToast("error", "Vui lòng nhập mã voucher!");
      return;
    }

    let newDiscount = 0;
    if (voucherCode.toUpperCase() === "GIAM10") {
      newDiscount = subtotal * 0.1;
    } else if (voucherCode.toUpperCase() === "GIAM50K") {
      newDiscount = 50000;
    } else {
      showToast("error", "Mã voucher không hợp lệ!");
      return;
    }

    setDiscount(newDiscount);
    showToast("success", `Áp dụng voucher thành công! Giảm ${formatCurrency(newDiscount)}`);
  };

  const handleCompletePayment = async () => {
    setLoading(true);
    try {
      const orderData = {
        customer_id: customer?.customer_id || null,
        table_id: tableId || null,
        note: note?.trim() || "",
        items: orderItems.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.qty,
        })),
        voucher: voucherCode || null,
        discount: discount, // voucher
        rank_discount: rankDiscount, // giảm giá theo rank
      };

      console.log("📦 Sending order:", orderData);

      const orderRes = await axiosClient.post("/orders", orderData);
      const orderId = orderRes?.data?.data?.order_id;

      if (!orderId) throw new Error("Không nhận được order_id từ server");

      const paymentPayload = {
        order_id: orderId,
        payment_method: paymentMethod,
        amount: total,
      };

      console.log("💳 Sending payment:", paymentPayload);
      await axiosClient.post("/payments", paymentPayload);

      // showToast("success", "✅ Thanh toán thành công!");
      // setShowSuccess(true);

      if (onCompletePayment)
  onCompletePayment({
    ...orderRes.data,
    table_id: tableId,
    table: tableName,
    items: orderItems,
    total: total,
    note: note,
    customer: customer
  });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Lỗi khi thanh toán:", err.response || err);
      showToast("error", "Lỗi khi thanh toán. Vui lòng thử lại.");
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

      {/* Success popup */}
      {/* {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[99999]">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center animate-bounce">
            <CheckCircle className="text-green-500" size={60} />
            <p className="text-xl font-bold mt-2 text-green-600">
              Thanh toán thành công!
            </p>
          </div>
        </div>
      )} */}

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
                    <h5 className="font-semibold">{item.menu_item_name}</h5>
                    <p className="text-gray-500 text-sm">
                      {formatCurrency(item.price)} x {item.qty}
                    </p>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(item.price * item.qty)}
                  </div>
                </div>
              ))}

              <div className="mt-4 space-y-1 text-gray-700">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <b>{formatCurrency(subtotal)}</b>
                </div>

                {/* Voucher */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
                    <Tag className="text-indigo-600" size={18} />
                    <input
                      type="text"
                      placeholder="Nhập mã voucher"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="flex-1 outline-none bg-transparent text-sm"
                    />
                  </div>
                  <button
                    onClick={handleApplyVoucher}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Giảm giá theo voucher */}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 mt-1">
                    <span>Giảm giá voucher</span>
                    <b>-{formatCurrency(discount)}</b>
                  </div>
                )}

                {/* Giảm giá theo rank */}
                {rankInfo.percent > 0 && (
                  <div className="flex justify-between text-blue-600 mt-1">
                    <span>Giảm giá hạng {rankInfo.rank} ({rankInfo.percent}%)</span>
                    <b>-{formatCurrency(rankDiscount)}</b>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Thành tiền</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Note */}
              {note && note.trim() !== "" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-gray-700 text-sm">
                  <b>Ghi chú đơn hàng:</b>
                  <p className="mt-1 whitespace-pre-line">{note}</p>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div>
              <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>

              {customer ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm mb-4">
                  <p className="font-bold text-gray-800">{customer.customer_name}</p>
                  <p className="text-gray-600">📞 {customer.phone}</p>
                  <p className="text-yellow-600 font-semibold mt-1">
                    ⭐ Điểm tích luỹ: {customer.points ?? 0}
                  </p>
                  <p className="text-blue-600 font-medium mt-1">
                    🎖️ Hạng: {rankInfo.rank}
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
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl shadow-sm border mb-2 transition ${
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
                className="w-full bg-green-500 text-white font-semibold py-4 rounded-xl mt-4 hover:bg-green-600 shadow transition"
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
