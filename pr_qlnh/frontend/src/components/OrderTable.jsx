import React, { useState } from "react";
import { Eye, CheckCircle } from "react-feather";

const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return num.toLocaleString("vi-VN") + " đ";
};

const OrderTable = ({ orders = [], onViewDetails, onCompleteOrder }) => {
  const currentOrders = Array.isArray(orders) ? orders : [];

  // -----------------------------
  // 🔥 PHÂN TRANG
  // -----------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số đơn/trang

  const totalPages = Math.ceil(currentOrders.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = currentOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "đã thanh toán":
      case "completed":
        return "bg-green-100 text-green-700";
      case "đang xử lý":
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "đã huỷ":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="min-w-full divide-y divide-gray-200 text-center">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              MÃ ĐƠN
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              BÀN
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              TỔNG TIỀN
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              TRẠNG THÁI
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              THỜI GIAN
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              KHÁCH HÀNG
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
              THAO TÁC
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.table || "Không xác định"}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status || "Chưa rõ"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.time || "—"}
                </td>

                {/* Khách hàng */}
                <td className="px-6 py-4 text-sm text-gray-700 max-w-[250px] truncate">
                  {order.customer ? (
                    <div
                      title={`${order.customer.name} - ${order.customer.points ?? 0} điểm`}
                    >
                      <p className="font-medium text-gray-900">
                        {order.customer.name}
                      </p>
                      {order.customer.points != null && (
                        <p className="text-green-600 text-xs">
                          ⭐ {order.customer.points} điểm
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Khách lẻ</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Xem chi tiết"
                  >
                    <Eye size={18} />
                  </button>

                  {order.status?.toLowerCase() !== "đã thanh toán" && (
                    <button
                      onClick={() => onCompleteOrder(order.id)}
                      className="text-green-500 hover:text-green-700 transition"
                      title="Hoàn thành"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-gray-500 py-6 italic">
                Đang tải dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <span className="text-sm text-gray-900">
          Hiển thị {paginatedOrders.length}/{currentOrders.length} đơn hàng
        </span>

        {totalPages > 1 && (
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
