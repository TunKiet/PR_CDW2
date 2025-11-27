import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function UpcomingReservations({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) {
  const [rawData, setRawData] = useState([]); // dữ liệu gốc từ API
  const [reservations, setReservations] = useState([]); // dữ liệu đã lọc
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // ============================================
  // GET API
  // ============================================
  const loadReservations = async () => {
    setLoading(true);

    try {
      const res = await axiosClient.get("/reservation-management", {
        params: {
          search: searchTerm,
          date: dateFilter,
          per_page: 200
        },
      });

      const data = res.data.data.data || [];

      setRawData(data); // lưu để còn lọc
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    }

    setLoading(false);
  };

  // gọi API khi filter thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      loadReservations();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dateFilter]);

  // ============================================
  // FILTER TRẠNG THÁI (CHỈ LỌC TRONG FE)
  // ============================================
  useEffect(() => {
    let result = rawData;

    // chuyển hết status thành lowercase cho đồng nhất
    result = result.map(item => ({
      ...item,
      status: item.status?.toLowerCase()
    }));

    // Upcoming tab chỉ lấy Pending + Confirmed
    result = result.filter(item =>
      ["pending", "confirmed"].includes(item.status)
    );

    // Lọc theo trạng thái từ dropdown
    if (statusFilter !== "All") {
      result = result.filter(item =>
        item.status === statusFilter.toLowerCase()
      );
    }

    setReservations(result);
  }, [rawData, statusFilter]);

  // ============================================
  // UPDATE STATUS API
  // ============================================
  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axiosClient.put(`/reservation-management/${id}/status`, {
        status: newStatus,
      });
      loadReservations();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
    setUpdatingId(null);
  };

  // ============================================
  // UI
  // ============================================
  return (
    <section className="bg-white p-6 rounded-xl shadow-inner border border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Danh sách đặt bàn (Chờ xử lý & Đã xác nhận)
      </h2>

      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* SEARCH */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 w-full border rounded-lg py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Tìm kiếm..."
          />
        </div>

        {/* FILTER STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Confirmed">Đã xác nhận</option>
        </select>

        {/* FILTER DATE */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Mã</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Bàn</th>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading && reservations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có đơn phù hợp
                </td>
              </tr>
            )}

            {!loading &&
              reservations.map((item) => (
                <tr key={item.reservation_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{item.reservation_id}</td>

                  {/* Customer name + phone */}
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.user?.username || "Khách vãng lai"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.user?.phone}
                    </div>
                  </td>

                  <td className="px-4 py-3">{item.table_id}</td>

                  <td className="px-4 py-3">
                    {item.reservation_time} ({item.reservation_date})
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-center">
                    {/* Pending */}
                    {item.status === "pending" && (
                      <>
                        <button
                          disabled={updatingId === item.reservation_id}
                          className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                          onClick={() =>
                            handleUpdateStatus(item.reservation_id, "Confirmed")
                          }
                        >
                          {updatingId === item.reservation_id ? "..." : "Xác nhận"}
                        </button>

                        <button
                          disabled={updatingId === item.reservation_id}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() =>
                            handleUpdateStatus(item.reservation_id, "Cancelled")
                          }
                        >
                          {updatingId === item.reservation_id ? "..." : "Huỷ"}
                        </button>
                      </>
                    )}

                    {/* Confirmed */}
                    {item.status === "confirmed" && (
                      <>
                        <button
                          disabled={updatingId === item.reservation_id}
                          className="px-3 py-1 bg-indigo-600 text-white rounded mr-2"
                          onClick={() =>
                            handleUpdateStatus(item.reservation_id, "Completed")
                          }
                        >
                          {updatingId === item.reservation_id ? "..." : "Hoàn tất"}
                        </button>

                        <button
                          disabled={updatingId === item.reservation_id}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() =>
                            handleUpdateStatus(item.reservation_id, "Cancelled")
                          }
                        >
                          {updatingId === item.reservation_id ? "..." : "Huỷ"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
