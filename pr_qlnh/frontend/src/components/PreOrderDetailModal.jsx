import React from "react";
import { X } from "lucide-react";

const PreOrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const totalPrice = order.total_price?.toLocaleString() || "0";
  const deposit = order.deposit_amount?.toLocaleString() || "0";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[700px] max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Chi tiết đơn hàng: {order.order_code}
        </h2>

        {/* Thông tin khách hàng */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm">
          <p>
            <span className="font-semibold">Khách hàng:</span>{" "}
            {order.customer_name}
          </p>
          <p>
            <span className="font-semibold">Ngày đặt:</span>{" "}
            {order.order_date}
          </p>
          <p>
            <span className="font-semibold">Trạng thái:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === "Chờ xác nhận"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>

        {/* Danh sách món ăn */}
        <div className="overflow-x-auto">
          <table className="w-full border-t text-sm">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="py-2 px-3 text-left">#</th>
                <th className="py-2 px-3 text-left">Tên món</th>
                <th className="py-2 px-3 text-center">SL</th>
                <th className="py-2 px-3 text-right">Đơn giá</th>
                <th className="py-2 px-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.order_details && order.order_details.length > 0 ? (
                order.order_details.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{idx + 1}</td>
                    <td className="py-2 px-3">{item.menu_item_name}</td>
                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                    <td className="py-2 px-3 text-right">
                      {item.price.toLocaleString()} VNĐ
                    </td>
                    <td className="py-2 px-3 text-right font-medium">
                      {(item.quantity * item.price).toLocaleString()} VNĐ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-4 italic"
                  >
                    Không có món ăn trong đơn này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tổng cộng */}
        <div className="mt-4 text-right border-t pt-4">
          <p>
            <span className="font-semibold">Tổng tiền: </span>
            <span className="font-bold text-gray-800">{totalPrice} VNĐ</span>
          </p>
          <p className="text-red-600 font-semibold">
            Tiền cọc (50%): {deposit} VNĐ
          </p>
        </div>

        {/* Nút đóng */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreOrderDetailModal;
