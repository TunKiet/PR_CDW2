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
  const [rawData, setRawData] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // dòng nào đang mở note
  const [openedNoteId, setOpenedNoteId] = useState(null);

  // ================================
  // LOAD API
  // ================================
  const loadReservations = async () => {
    setLoading(true);

    try {
      const res = await axiosClient.get("/reservation-management", {
        params: {
          search: searchTerm,
          date: dateFilter,
          per_page: 200,
        },
      });

      const data = res.data.data.data || [];
      setRawData(data);

    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }

    setLoading(false);
  };

  // tải khi search hoặc date thay đổi
  useEffect(() => {
    const timer = setTimeout(loadReservations, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, dateFilter]);

  // ================================
  // FILTER FE
  // ================================
  useEffect(() => {
    let result = rawData.map(item => ({
      ...item,
      status: item.status?.toLowerCase(),
    }));

    // Upcoming chỉ lấy pending + confirmed
    result = result.filter(item =>
      ["pending", "confirmed"].includes(item.status)
    );

    // lọc thêm theo dropdown
    if (statusFilter !== "All") {
      result = result.filter(item =>
        item.status === statusFilter.toLowerCase()
      );
    }

    setReservations(result);
  }, [rawData, statusFilter]);


  // ================================
  // UPDATE STATUS
  // ================================
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


  // ================================
  // UI
  // ================================
  return (
    <section className="bg-white p-6 rounded-xl shadow-inner border border-gray-300">

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Danh sách đặt bàn (Chờ xử lý & Đã xác nhận)
      </h2>

      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 w-full border rounded-lg py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Tìm kiếm..."
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full bg-white"
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Confirmed">Đã xác nhận</option>
        </select>

        {/* Date */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full bg-white"
        />
      </div>


      {/* TABLE */}
      <div className="border rounded-xl overflow-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Mã</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Bàn & số lượng</th>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && reservations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có đơn phù hợp
                </td>
              </tr>
            )}

            {/* DATA */}
            {!loading &&
              reservations.map((item) => (
                <tr
                key={item.reservation_id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                    setOpenedNoteId(
                    openedNoteId === item.reservation_id ? null : item.reservation_id
                    )
                }
                >
                {/* Mã */}
                <td className="px-4 py-3">{item.reservation_id}</td>

                {/* Khách */}
                <td className="px-4 py-3">
                    <div className="font-medium">{item.user?.username || "Khách vãng lai"}</div>
                    <div className="text-xs text-gray-500">{item.user?.phone}</div>
                </td>

                {/* Bàn & số lượng */}
                <td className="px-4 py-3">
                    <span className="text-indigo-600 font-medium">
                    {item.table?.table_name}
                    </span>
                    {" – "}
                    <span className="text-gray-700">{item.num_guests} Khách</span>
                </td>

                {/* Thời gian */}
                <td className="px-4 py-3">
                    {item.reservation_time} ({item.reservation_date})
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-3">
                    <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                    >
                    {item.status}
                    </span>
                </td>

                {/* ACTION + TOOLTIP (quan trọng: tooltip phải nằm TRONG 1 TD) */}
                <td className="px-4 py-3 text-center relative">

                    {/* TOOLTIP GHI CHÚ — KHÔNG PHÁ TABLE */}
                    {item.note && openedNoteId === item.reservation_id && (
                    <div className="
                        absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full
                        bg-black text-white text-xs px-3 py-2 rounded shadow-lg
                        z-50 w-max max-w-xs whitespace-pre-wrap
                    ">
                        {item.note}
                    </div>
                    )}

                    {/* Pending */}
                    {item.status === "pending" && (
                    <div className="flex flex-col gap-2 items-center">
                        <button
                        disabled={updatingId === item.reservation_id}
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(item.reservation_id, "Confirmed");
                        }}
                        >
                        {updatingId === item.reservation_id ? "..." : "Xác nhận"}
                        </button>

                        <button
                        disabled={updatingId === item.reservation_id}
                        className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(item.reservation_id, "Cancelled");
                        }}
                        >
                        {updatingId === item.reservation_id ? "..." : "Huỷ"}
                        </button>
                    </div>
                    )}

                    {/* Confirmed */}
                    {item.status === "confirmed" && (
                    <div className="flex flex-col gap-2 items-center">
                        <button
                        disabled={updatingId === item.reservation_id}
                        className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(item.reservation_id, "Completed");
                        }}
                        >
                        {updatingId === item.reservation_id ? "..." : "Hoàn tất"}
                        </button>

                        <button
                        disabled={updatingId === item.reservation_id}
                        className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(item.reservation_id, "Cancelled");
                        }}
                        >
                        {updatingId === item.reservation_id ? "..." : "Huỷ"}
                        </button>
                    </div>
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
