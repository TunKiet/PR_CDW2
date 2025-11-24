import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OrderTable from "../components/OrderTable";
import axios from "axios";

const OrderManagementPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Lấy danh sách đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/orders");
        console.log("📦 DỮ LIỆU API TRẢ VỀ:", res.data);

        // Xử lý nếu backend trả về mảng trực tiếp hoặc object chứa data
        const ordersArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const formatted = ordersArray.map((o) => {
          console.log("🧩 DỮ LIỆU TỪNG ĐƠN:", o); // debug từng đơn

          return {
            id: "DH" + o.order_id,
            table: o.table_name || "Mang về",
            total: parseFloat(o.total_price) || 0,
            status: o.status || "Đã thanh toán",
            time: o.created_at
              ? new Date(o.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--",
            notes: o.note || o.notes || "",
            statusColor:
              o.status === "Đã hủy"
                ? "bg-red-100 text-red-700"
                : o.status === "Đang phục vụ"
                ? "bg-blue-100 text-blue-700"
                : o.status === "Chờ xử lý"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700",

            customer: o.customer
                ? {
                    name: o.customer.name,
                    phone: o.customer.phone,
                    points: o.customer.points,
                  }
                : null,


            // ✅ Bắt lỗi .map() bằng fallback mảng rỗng
            items: (o.orderDetails ?? o.order_details ?? []).map((d) => ({
              name: d.menu_item?.menu_item_name || "Món ăn",
              price: d.price ?? 0,
              quantity: d.quantity ?? 1,
            })),
          };
        });

        setCurrentOrders(formatted);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách đơn:", err);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Nếu vừa thanh toán xong, nhận đơn mới từ localStorage
  useEffect(() => {
    const newOrder = JSON.parse(localStorage.getItem("lastOrder"));
    if (newOrder) {
      console.log("🧾 ĐƠN HÀNG MỚI TỪ LOCALSTORAGE:", newOrder);

      const generatedId = "DH" + Math.floor(1000 + Math.random() * 9000);

      const formattedOrder = {
        id: generatedId,
        table: newOrder.table || "Mang về",
        total: newOrder.total || 0,
        status: "Đã thanh toán",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        notes: "",
        statusColor: "bg-green-100 text-green-700",
        items: (newOrder.items ?? []).map((i) => ({
          name: i.menu_item_name || i.name || "Món ăn",
          price: i.price ?? 0,
          quantity: i.qty ?? i.quantity ?? 1,
        })),
      };

      setCurrentOrders((prev) => [formattedOrder, ...prev]);
      localStorage.removeItem("lastOrder");
    }
  }, []);

  // ✅ Mở modal chi tiết
  const handleViewDetails = (order) => {
    setSelectedOrder(JSON.parse(JSON.stringify(order)));
  };

  // ✅ Lưu chỉnh sửa
  const handleSaveOrder = (updatedOrder) => {
    setCurrentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    setSelectedOrder(null);
  };

  // ✅ Hoàn tất đơn
  const handleCompleteOrder = (orderId) => {
    setCurrentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Đã thanh toán",
              statusColor: "bg-green-100 text-green-700",
            }
          : order
      )
    );
    setSelectedOrder(null);
  };

  // ✅ Lọc đơn hàng theo từ khóa
  const filteredOrders = currentOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6 justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản Lý Đơn Hàng
          </h1>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, bàn hoặc trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <OrderTable
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          onEdit={handleViewDetails}
          onCompleteOrder={handleCompleteOrder}
        />
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleSaveOrder}
          onCompleteOrder={handleCompleteOrder}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;
