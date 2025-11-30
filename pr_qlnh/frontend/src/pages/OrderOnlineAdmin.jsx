import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./OrderOnlineAdmin.css";

const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);

const statusLabel = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  delivering: "Đang giao",
  done: "Hoàn tất",
  cancelled: "Đã hủy",
};

export default function OrderOnlineAdmin() {
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [message, setMessage] = useState("");

  // ===================================================
  // LOAD DANH SÁCH ĐƠN — TỰ GỌI LẠI KHI STATUS THAY ĐỔI
  // ===================================================
  useEffect(() => {
    fetchOrders(1);
  }, [status]);

  async function fetchOrders(page = 1) {
    setLoading(true);

    const url = new URL("http://127.0.0.1:8000/api/order-online");
    url.searchParams.append("page", page);

    if (search.trim() !== "") url.searchParams.append("q", search);
    if (status.trim() !== "") url.searchParams.append("status", status);

    try {
      const res = await fetch(url);
      const data = await res.json();

      setOrders(data.data || []);
      setPageInfo(data);
    } catch (err) {
      alert("Không thể tải danh sách đơn hàng");
    }

    setLoading(false);
  }

  // ===================================================
  // CLICK VÀO TRẠNG THÁI ĐỂ LỌC
  // ===================================================
  function filterByStatus(s) {
    setStatus(s); // chỉ SET, không fetch ngay
  }

  // ===================================================
  // LẤY CHI TIẾT ĐƠN HÀNG
  // ===================================================
  async function openDetail(id) {
    setIsLoadingDetail(true);
    setSelectedOrder(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/order-online/${id}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      alert("Không tải được chi tiết đơn hàng");
    }

    setIsLoadingDetail(false);
  }

  // ===================================================
  // CẬP NHẬT TRẠNG THÁI
  // ===================================================
  async function updateStatus(id, newStatus) {
    const statusText = statusLabel;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/order-online/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      setMessage(`✔ Đã cập nhật trạng thái: ${statusText[newStatus]}`);
      setTimeout(() => setMessage(""), 2000);

      fetchOrders();

      if (selectedOrder)
        setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch {
      alert("Không thể cập nhật trạng thái!");
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <h1 className=" text-2xl font-semibold text-gray-800 mb-6">Quản lý Đơn Hàng Online</h1>

        {/* BỘ LỌC */}
        <div className="filter-row flex flex-wrap items-center rounded-lg mb-3 gap-2">

          {/* Ô tìm kiếm */}
          <input
            placeholder="Tìm theo tên, số điện thoại, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders(1)}
            className="flex-1 min-w-[250px] px-4  border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          {/* Nút tìm */}
          <button
            onClick={() => fetchOrders(1)}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow 
               hover:bg-indigo-700 active:scale-95 transition gap-4"
          >
            Tìm
          </button>

          {/* Lọc trạng thái */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-w-[180px]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="delivering">Đang giao</option>
            <option value="done">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>


        {/* BẢNG ĐƠN */}
        <table className="order-table">
          {loading && (
            <tbody>
              <tr>
                <td colSpan={7} className="text-center py-6 loading-msg">
                  🔄 Đang tải dữ liệu...
                </td>
              </tr>
            </tbody>
          )}

          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Phone</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{String(o.id).padStart(6, "0")}</td>
                <td>{o.customer_name}</td>
                <td>{o.phone}</td>
                <td>{formatCurrency(o.total)}</td>

                <td>
                  <span
                    className={`status ${o.status} status-clickable`}
                    onClick={() => filterByStatus(o.status)}
                  >
                    {statusLabel[o.status]}
                  </span>
                </td>

                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => openDetail(o.id)}>Xem</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="pagination">
          <button
            disabled={pageInfo.current_page === 1}
            onClick={() => fetchOrders(pageInfo.current_page - 1)}
          >
            ◀
          </button>

          <span>
            {pageInfo.current_page} / {pageInfo.last_page}
          </span>

          <button
            disabled={pageInfo.current_page === pageInfo.last_page}
            onClick={() => fetchOrders(pageInfo.current_page + 1)}
          >
            ▶
          </button>
        </div>

        {/* MODAL CHI TIẾT */}
        {(isLoadingDetail || selectedOrder) && (
          <div className="modal" onClick={() => setSelectedOrder(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              {!selectedOrder ? (
                <p>Đang tải chi tiết...</p>
              ) : (
                <>
                  <h3>
                    Đơn #{String(selectedOrder.id).padStart(6, "0")} —{" "}
                    {selectedOrder.customer_name}
                  </h3>

                  <p>
                    <b>Điện thoại:</b> {selectedOrder.phone}
                  </p>

                  <p>
                    <b>Địa chỉ giao hàng:</b> {selectedOrder.address_detail}
                  </p>

                  <p>
                    <b>Thanh toán:</b> {selectedOrder.payment_method}
                  </p>

                  <h4>Danh sách món ăn</h4>

                  <div className="item-list">
                    <div className="item-list-header">
                      <span>Tên món</span>
                      <span>Số lượng</span>
                      <span className="price">Giá</span>
                    </div>

                    {selectedOrder.items.map((i) => (
                      <div key={i.id} className="item-row">
                        <span className="item-name">
                          {i.menu.menu_item_name}
                        </span>
                        <span className="item-qty">{i.quantity}</span>
                        <span className="item-price">
                          {formatCurrency(i.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p>
                    <b>Tạm tính:</b>{" "}
                    {formatCurrency(
                      selectedOrder.total -
                      selectedOrder.ship_fee +
                      selectedOrder.discount
                    )}
                  </p>

                  <p>
                    <b>Phí ship:</b> {formatCurrency(selectedOrder.ship_fee)}
                  </p>

                  <p>
                    <b>Giảm giá:</b> {formatCurrency(selectedOrder.discount)}
                  </p>

                  <p>
                    <b>Tổng cộng:</b> {formatCurrency(selectedOrder.total)}
                  </p>

                  <div className="modal-actions">
                    <button
                      onClick={() =>
                        updateStatus(selectedOrder.id, "confirmed")
                      }
                    >
                      ✔ Xác nhận
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedOrder.id, "delivering")
                      }
                    >
                      🚚 Đang giao
                    </button>
                    <button
                      onClick={() => updateStatus(selectedOrder.id, "done")}
                    >
                      ✅ Hoàn tất
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedOrder.id, "cancelled")
                      }
                    >
                      ❌ Hủy
                    </button>

                    <button
                      className="close"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Đóng
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* THÔNG BÁO */}
        {message && <div className="toast-msg">{message}</div>}
      </div>
    </div>
  );
}
