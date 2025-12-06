import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function HistoryReservations({
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

  // tooltip note khi click
  const [openedNoteId, setOpenedNoteId] = useState(null);

  // ================================================
  // LOAD API
  // ================================================
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
      console.error("Lỗi tải lịch sử:", err);
    }

    setLoading(false);
  };

  // gọi API nếu search/date thay đổi
  useEffect(() => {
    const t = setTimeout(loadReservations, 300);
    return () => clearTimeout(t);
  }, [searchTerm, dateFilter]);

  // ================================================
  // FILTER FE: Lịch sử = Completed + Cancelled
  // ================================================
  useEffect(() => {
    let result = rawData.map(item => ({
      ...item,
      status: item.status?.toLowerCase(),
    }));

    result = result.filter(item =>
      ["completed", "cancelled"].includes(item.status)
    );

    if (statusFilter !== "All") {
      result = result.filter(
        item => item.status === statusFilter.toLowerCase()
      );
    }

    setReservations(result);
  }, [rawData, statusFilter]);


  // ================================================
  // UI
  // ================================================
  return (
    <section className="bg-white p-6 rounded-xl shadow-inner border border-gray-300">

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Lịch sử đặt bàn
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

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full bg-white"
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="Completed">Hoàn tất</option>
          <option value="Cancelled">Đã huỷ</option>
        </select>

        {/* DATE */}
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
              <th className="px-4 py-3 text-center">Ghi chú</th>
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
                  Không có lịch sử đặt bàn
                </td>
              </tr>
            )}

            {!loading &&
              reservations.map((item) => (
                <tr
                  key={item.reservation_id}
                  className="border-t hover:bg-gray-50 relative cursor-pointer"
                  onClick={() =>
                    setOpenedNoteId(
                      openedNoteId === item.reservation_id
                        ? null
                        : item.reservation_id
                    )
                  }
                >

                  {/* NOTE POPUP */}
                  {item.note && openedNoteId === item.reservation_id && (
                    <div
                      className="
                        absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full
                        bg-black text-white text-xs px-3 py-2 rounded shadow-lg
                        z-50 w-max max-w-xs
                      "
                    >
                      {item.note}
                    </div>
                  )}

                  {/* Mã */}
                  <td className="px-4 py-3">{item.reservation_id}</td>

                  {/* Khách */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.user?.username}</div>
                    <div className="text-xs text-gray-500">{item.user?.phone}</div>
                  </td>

                  {/* Bàn */}
                  <td className="px-4 py-3">
                    <span className="text-indigo-600 font-medium">
                      {item.table?.table_name || item.table_id}
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
                        item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Ghi chú (nút xem ghi chú) */}
                  <td className="px-4 py-3 text-center">
                    {item.note ? (
                      <button className="text-indigo-600 underline text-sm">
                        Xem ghi chú
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Không có</span>
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
