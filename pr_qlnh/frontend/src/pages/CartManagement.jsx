import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const CartManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Gọi API lấy danh sách đơn
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/pre-orders");
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách đơn:", error);
    }
  };

  // ✅ Khi mount component
  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Khi click xem chi tiết
  const openModal = async (order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    setOrderDetails([]);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/pre-order-details/${order.pre_order_id}`
      );
      setOrderDetails(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải chi tiết:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  // ✅ Cập nhật trạng thái đơn
  const handleStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/pre-orders/${id}/status`, { status });
      fetchOrders();
      alert(status === "confirmed" ? "✅ Đơn hàng đã được xác nhận!" : "❌ Đơn hàng đã bị hủy!");
    } catch (error) {
      alert("⚠️ Lỗi khi cập nhật trạng thái!");
      console.error(error);
    }
  };

  // ✅ Lọc danh sách theo ô tìm kiếm
  const filteredOrders = orders.filter(
    (o) =>
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.order_code?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Xuất PDF danh sách đơn
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Danh sách đơn đặt trước", 14, 15);

    const tableData = filteredOrders.map((o) => [
      o.order_code,
      o.customer_name,
      new Date(o.order_datetime).toLocaleString(),
      `${Number(o.total_amount).toLocaleString()} ₫`,
      `${Number(o.deposit_amount).toLocaleString()} ₫`,
      o.status,
    ]);

    doc.autoTable({
      head: [["Mã đơn", "Khách hàng", "Thời gian", "Tổng tiền", "Cọc", "Trạng thái"]],
      body: tableData,
      startY: 25,
    });

    doc.save("DanhSachDonHang.pdf");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">
          Quản Lý Giỏ Hàng (Đơn đặt trước)
        </h1>

        {/* Thanh công cụ */}
        <div className="flex justify-between items-center mb-5">
          <div className="space-x-3">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Làm mới danh sách
            </button>

            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Xuất file PDF
            </button>
          </div>

          <input
            type="text"
            placeholder="🔍 Tìm theo mã đơn hoặc khách hàng..."
            className="border rounded-lg px-3 py-2 w-64 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bảng danh sách */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
              <tr>
                <th className="p-3 text-left">Mã đơn</th>
                <th className="p-3 text-left">Khách hàng</th>
                <th className="p-3 text-left">Ngày/Giờ đặt</th>
                <th className="p-3 text-left">Tổng tiền</th>
                <th className="p-3 text-left">Tiền cọc</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-gray-500">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.pre_order_id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{o.order_code}</td>
                    <td className="p-3">{o.customer_name}</td>
                    <td className="p-3">{new Date(o.order_datetime).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {Number(o.total_amount).toLocaleString()} ₫
                    </td>
                    <td className="p-3 text-red-600 font-semibold">
                      {Number(o.deposit_amount).toLocaleString()} ₫
                    </td>
                    <td className="p-3">
                      {o.status === "pending" && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Chờ xác nhận
                        </span>
                      )}
                      {o.status === "confirmed" && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Đã xác nhận
                        </span>
                      )}
                      {o.status === "cancelled" && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                          Đã hủy
                        </span>
                      )}
                      {o.status === "paid" && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Đã thanh toán
                        </span>
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => openModal(o)}
                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                      >
                        Xem
                      </button>
                      {o.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatus(o.pre_order_id, "confirmed")}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleStatus(o.pre_order_id, "cancelled")}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Hủy
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal chi tiết đơn */}
        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
              {/* Nút đóng */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Chi tiết đơn #{selectedOrder?.pre_order_id}
              </h2>

              {detailLoading ? (
                <div className="text-center text-gray-500 py-6">
                  Đang tải dữ liệu chi tiết món ăn...
                </div>
              ) : orderDetails.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  Không có món ăn nào trong đơn này.
                </div>
              ) : (
                <table className="w-full text-sm text-gray-700 border rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Tên món</th>
                      <th className="px-4 py-2 text-left">Số lượng</th>
                      <th className="px-4 py-2 text-left">Giá</th>
                      <th className="px-4 py-2 text-left">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{item.dish_name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">
                          {Number(item.price).toLocaleString()}₫
                        </td>
                        <td className="px-4 py-2">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Footer modal */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleStatus(selectedOrder.pre_order_id, "confirmed")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Xác nhận đơn
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(selectedOrder.pre_order_id, "cancelled")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Hủy đơn
                  </button>
                </div>

                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartManagement;
