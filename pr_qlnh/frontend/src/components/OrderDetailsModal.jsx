// src/components/OrderDetailsModal.jsx
import React from "react";
import { X, Trash2, FileText } from "lucide-react";

const formatCurrency = (n) =>
  Number(n).toLocaleString("vi-VN") + " đ";

const OrderDetailsModal = ({
  order,
  onClose,
  onDelete,
  onPrintPDF,
  role = "staff",
}) => {
  if (!order) return null;

  // --- SUBTOTAL ---
  const subtotal = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // --- RANK DISCOUNT ---
  const getRankDiscount = (points) => {
    if (points >= 50000) return { rank: "Kim Cương", percent: 10 };
    if (points >= 15000) return { rank: "Vàng", percent: 5 };
    if (points >= 5000) return { rank: "Bạc", percent: 3 };
    return { rank: "Đồng", percent: 0 };
  };

  const rankInfo = getRankDiscount(order.customer?.points || 0);
  const rankDiscount = (subtotal * rankInfo.percent) / 100;

  // --- VOUCHER ---
  const voucherCode = order.voucher || null;
  const voucherDiscount = Number(order.discount || 0);

  console.log(">>> DEBUG VOUCHER:", {
    voucherCode,
    voucherDiscount,
  });

  const confirmDelete = () => {
    if (!window.confirm("Bạn chắc muốn xóa đơn hàng này?")) return;
    onDelete(order.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[75vw] max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">
            CHI TIẾT ĐƠN {order.id}
          </h2>

          <div className="flex gap-2">

            {/* DELETE */}
            {role === "admin" && (
              <button
                onClick={confirmDelete}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg"
              >
                <Trash2 size={18} />
                Xóa
              </button>
            )}

            {/* PDF */}
            <button
              onClick={() => onPrintPDF(order)}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg"
            >
              <FileText size={18} />
              In hóa đơn
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 grid grid-cols-3 gap-6">

          {/* ITEMS */}
          <div className="col-span-2 space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">
              Danh sách món
            </h3>

            {order.items.map((item) => (
              <div
                key={item.menu_item_id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-sm">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <span className="font-bold text-blue-600">
                  x{item.quantity}
                </span>

                <span className="w-24 text-right font-bold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="col-span-1 bg-blue-50 rounded-lg p-4 h-min sticky top-20">
            <h3 className="font-semibold text-lg border-b pb-2 mb-3">
              Tóm tắt
            </h3>

            <p><strong>Bàn:</strong> {order.table}</p>
            <p><strong>Thời gian:</strong> {order.time}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className="font-bold text-orange-600">
                {order.status}
              </span>
            </p>

            <div className="border-t mt-3 pt-3 space-y-2">

              {/* Tổng tiền hàng */}
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Tổng tiền hàng</span>
                <b>{formatCurrency(subtotal)}</b>
              </div>

              {/* Voucher */}
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Giảm giá voucher ({voucherCode})</span>
                  <b>-{formatCurrency(voucherDiscount)}</b>
                </div>
              )}

              {/* Rank Discount */}
              {rankDiscount > 0 && (
                <div className="flex justify-between text-blue-600 text-sm">
                  <span>Giảm giá hạng {rankInfo.rank} ({rankInfo.percent}%)</span>
                  <b>-{formatCurrency(rankDiscount)}</b>
                </div>
              )}

              <hr />

              {/* Thành tiền */}
              <div className="flex justify-between font-bold text-xl text-blue-800">
                <span>Thành tiền</span>
                <span>
                  {formatCurrency(
                    subtotal - voucherDiscount - rankDiscount
                  )}
                </span>
              </div>
            </div>

            <div className="border-t mt-3 pt-3 text-sm text-gray-700">
              <strong>Ghi chú:</strong> {order.note || "Không có"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
