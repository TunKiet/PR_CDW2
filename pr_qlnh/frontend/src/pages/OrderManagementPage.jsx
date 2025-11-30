// src/pages/OrderManagementPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OrderTable from "../components/OrderTable";
import axiosClient from "../api/axiosClient";

const role = "admin";

const OrderManagementPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ============================================================
  // 1) UPDATE ORDER
  // ============================================================
  const handleSaveOrder = async (order) => {
    try {
      const payload = {
        note: order.note ?? "",
        discount: Number(order.discount) || 0,
        rank_discount: Number(order.rank_discount) || 0,
        voucher: order.voucher || null,

        items: order.items.map((i) => ({
          menu_item_id: i.menu_item_id,
          price: Number(i.price),
          quantity: Number(i.quantity),
        })),
      };

      console.log("📤 PAYLOAD GỬI LÊN:", payload);

      const response = await axiosClient.put(
        `/orders/${order.id.replace("DH", "")}`,
        payload
      );

      alert("Đơn hàng đã được cập nhật!");
      fetchOrders();
    } catch (error) {
      console.error("❌ Lỗi cập nhật đơn:", error);
      alert("Không thể cập nhật đơn hàng!");
    }
  };

  // ============================================================
  // 2) DELETE ORDER
  // ============================================================
  const handleDeleteOrder = async (id) => {
    try {
      await axiosClient.delete(`/orders/${id.replace("DH", "")}`);
      alert("Đơn hàng đã bị xóa!");
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("❌ Lỗi xóa đơn:", error);
      alert(error.response?.data?.message || "Không thể xóa đơn hàng!");
    }
  };

  // ============================================================
  // 3) EXPORT PDF
  // ============================================================
  const handlePrintPDF = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const html = `
      <html>
      <head>
        <title>Hóa đơn ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ccc; }
          th, td { padding: 8px; text-align: left; }
          .total { text-align: right; font-size: 22px; margin-top: 20px; }
        </style>
      </head>

      <body>
        <h1>HÓA ĐƠN THANH TOÁN</h1>

        <p><strong>Mã đơn:</strong> ${order.id}</p>
        <p><strong>Bàn:</strong> ${order.table}</p>
        <p><strong>Thời gian:</strong> ${order.time}</p>
        <hr>

        <table>
          <thead>
            <tr>
              <th>Món ăn</th>
              <th>SL</th>
              <th>Giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (i) => `
              <tr>
                <td>${i.name}</td>
                <td>${i.quantity}</td>
                <td>${i.price.toLocaleString("vi-VN")} đ</td>
                <td>${(i.price * i.quantity).toLocaleString("vi-VN")} đ</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2 class="total">Tổng cộng: ${order.total.toLocaleString("vi-VN")} đ</h2>

        <script>
          window.onload = () => window.print();
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // ============================================================
  // 4) FETCH ORDERS
  // ============================================================
  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders");
      console.log("📦 DỮ LIỆU API TRẢ VỀ:", res.data);

      const ordersArray = Array.isArray(res.data) ? res.data : [];

      const formatted = ordersArray.map((o) => ({
        id: "DH" + o.order_id,
        table: o.table_name || "Mang về",
        total: parseFloat(o.total_price) || 0,
        status: o.status || "Đã thanh toán",
        time: new Date(o.created_at).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        note: o.note || "",

        // FIXED
        discount: Number(o.discount) || 0,
        rank_discount: Number(o.rank_discount) || 0,
        voucher: o.voucher || null,

        customer: o.customer
          ? {
              name: o.customer.name,
              phone: o.customer.phone,
              points: o.customer.points,
            }
          : null,

        items: (o.orderDetails ?? []).map((d) => ({
          menu_item_id: d.menu_item_id,
          name: d.menu_item?.menu_item_name || "Món ăn",
          price: d.price ?? 0,
          quantity: d.quantity ?? 1,
        })),
      }));

      setCurrentOrders(formatted);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đơn:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ============================================================
  // 5) SEARCH
  // ============================================================
  const filteredOrders = currentOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================================
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 px-4 py-4">
        <div className="mb-6 justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản Lý Đơn Hàng
          </h1>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, bàn hoặc trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
        </div>

        <OrderTable
          orders={filteredOrders}
          onViewDetails={setSelectedOrder}
          onEdit={setSelectedOrder}
        />
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleSaveOrder}
          onDelete={handleDeleteOrder}
          onPrintPDF={handlePrintPDF}
          role={role}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;
