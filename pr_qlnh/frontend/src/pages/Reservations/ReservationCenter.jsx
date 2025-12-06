import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";

import UpcomingReservations from "./UpcomingReservations";
import HistoryReservations from "./HistoryReservations";
import FloorplanPanel from "./FloorplanPanel";

// Debounce timer
let debounceTimer = null;

export default function ReservationCenter() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // API data
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // ============================================
  // API: Lấy danh sách đặt bàn (Upcoming + History)
  // ============================================
  const loadReservations = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosClient.get("/reservation-management", {
        params: {
          search: searchTerm,
          status: statusFilter,
          date: dateFilter,
          per_page: 200,
        },
      });

      // Laravel paginate: data.data.data
      setReservations(res.data.data.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu đặt bàn:", err);
    }

    setLoading(false);
  }, [searchTerm, statusFilter, dateFilter]);

  // Debounce search/filter
  useEffect(() => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (activeTab !== "floorplan") loadReservations();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [loadReservations, activeTab]);

  // Khi đổi tab, nếu tab != floorplan thì load API
  useEffect(() => {
    if (activeTab !== "floorplan") loadReservations();
  }, [activeTab]);

  // ============================================
  // Chia nhóm dữ liệu theo tab
  // ============================================
  const upcomingList = reservations.filter((r) =>
    ["Pending", "Confirmed"].includes(r.status)
  );

  const historyList = reservations.filter((r) =>
    ["Completed", "Cancelled"].includes(r.status)
  );

  // ============================================
  // UI Render
  // ============================================
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">

        {/* HEADER */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">
            🍽️ Quản Lý Đặt Bàn
          </h1>
          <p className="text-sm text-gray-600">
            Theo dõi & xử lý các đơn đặt bàn theo thời gian thực.
          </p>
        </div>

        {/* TABS */}
        <div className="flex border-b bg-white rounded-t-xl shadow overflow-hidden">
          {[
            ["floorplan", "Sơ đồ bàn"],
            ["upcoming", "Đơn đang xử lý"],
            ["history", "Lịch sử đặt bàn"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`p-4 flex-1 text-center font-semibold transition ${
                activeTab === key
                  ? "border-b-4 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* PANELS */}
        <div className="mt-6">
          {activeTab === "upcoming" && (
            <UpcomingReservations
              loading={loading}
              reservations={upcomingList}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              // Callback khi cập nhật trạng thái ở file này -> reload API
              onStatusUpdated={loadReservations}
            />
          )}

          {activeTab === "history" && (
            <HistoryReservations
              loading={loading}
              reservations={historyList}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          )}

          {activeTab === "floorplan" && <FloorplanPanel />}
        </div>
      </main>
    </div>
  );
}
