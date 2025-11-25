import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Bell,
  LayoutGrid,
  CalendarCheck,
  History as HistoryIcon,
  Search as SearchIcon,
  ChevronDown,
  XCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

/**
 * ReservationCenter.jsx
 * - Một trang (tabbed) gồm: Floorplan / Reservations / History
 * - Giữ nguyên Sidebar hiện có
 * - Dùng Tailwind 4 classes (utility-first)
 *
 * NOTE: file này chứa mock data + demo logic; thay data bằng API khi cần.
 */

const DUMMY_NOTIFICATIONS = [
  { id: 1, type: "NewBooking", title: "Đơn đặt bàn mới!", detail: "R011: Khách hàng Lê Tuấn Đạt (4 chỗ) lúc 20:00.", time: "5 phút trước", read: false, icon: "bell", iconClass: "text-indigo-500" },
  { id: 2, type: "Conflict", title: "Cảnh báo trùng bàn!", detail: "Bàn T05 bị đặt hai lần vào lúc 19:30.", time: "1 giờ trước", read: false, icon: "alert-triangle", iconClass: "text-red-500" },
  { id: 3, type: "Completed", title: "Bàn đã hoàn tất", detail: "Bàn T06 đã hoàn tất thanh toán.", time: "Hôm qua", read: true, icon: "check-circle", iconClass: "text-green-500" },
];

const DUMMY_RESERVATIONS = [
  { id: "R001", tableId: "T05", customer: "Lê Văn Khải", phone: "0901xxxxxx", pax: 4, date: "2025-10-10", time: "19:30", status: "Pending" },
  { id: "R002", tableId: "T01", customer: "Nguyễn Thị Hoa", phone: "0912xxxxxx", pax: 2, date: "2025-10-10", time: "18:00", status: "Confirmed" },
  { id: "R003", tableId: "T09", customer: "Phạm Minh Đức", phone: "0987xxxxxx", pax: 3, date: "2025-10-11", time: "11:00", status: "Pending" },
  { id: "R004", tableId: "T06", customer: "Vũ Thanh Tùng", phone: "0966xxxxxx", pax: 4, date: "2025-10-11", time: "20:30", status: "Completed" },
  { id: "R005", tableId: "T07", customer: "Trần Ánh Tuyết", phone: "0934xxxxxx", pax: 6, date: "2025-10-12", time: "12:00", status: "Cancelled" },
];

const TABLE_LAYOUT = {
  T01: { area: "A", seats: 2, label: "Khu A" },
  T02: { area: "A", seats: 2, label: "Khu A" },
  T03: { area: "A", seats: 2, label: "Khu A" },
  T04: { area: "A", seats: 2, label: "Khu A" },
  T05: { area: "B", seats: 4, label: "Khu B" },
  T06: { area: "B", seats: 4, label: "Khu B" },
  T07: { area: "C", seats: 6, label: "Khu C" },
  T08: { area: "C", seats: 6, label: "Khu C" },
  T09: { area: "B", seats: 4, label: "Khu B" },
  T10: { area: "A", seats: 2, label: "Khu A" },
};

export default function ReservationCenter() {
  const [activeTab, setActiveTab] = useState("floorplan"); // floorplan | upcoming | history
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);

  // reservations state (would come from API)
  const [reservations, setReservations] = useState(DUMMY_RESERVATIONS);

  // Filters for reservations/history
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Dummy floor data (status per table)
  const [floorData, setFloorData] = useState({
    T01: { status: "Occupied", reservedBy: "Nguyễn Văn A" },
    T02: { status: "Available", reservedBy: "" },
    T03: { status: "Reserved", reservedBy: "Lê Thị B" },
    T04: { status: "Available", reservedBy: "" },
    T05: { status: "Occupied", reservedBy: "Trần Văn C" },
    T06: { status: "Reserved", reservedBy: "Phạm Thị D" },
    T07: { status: "Available", reservedBy: "" },
    T08: { status: "Occupied", reservedBy: "Hoàng Văn E" },
    T09: { status: "Available", reservedBy: "" },
    T10: { status: "Reserved", reservedBy: "Võ Thị F" },
  });

  // computed filtered lists
  const filteredUpcoming = useMemo(() => {
    // Upcoming: Pending + Confirmed (by default) unless statusFilter selected
    const statuses = statusFilter === "All" ? ["Pending", "Confirmed"] : [statusFilter];
    return reservations.filter((r) => statuses.includes(r.status) && matchSearchAndDate(r));
  }, [reservations, statusFilter, searchTerm, dateFilter]);

  const filteredHistory = useMemo(() => {
    // History: Completed + Cancelled (by default) unless statusFilter selected
    const statuses = statusFilter === "All" ? ["Completed", "Cancelled"] : [statusFilter];
    return reservations.filter((r) => statuses.includes(r.status) && matchSearchAndDate(r));
  }, [reservations, statusFilter, searchTerm, dateFilter]);

  function matchSearchAndDate(r) {
    if (dateFilter && r.date !== dateFilter) return false;
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const hay = `${r.id} ${r.customer} ${r.phone} ${r.tableId}`.toLowerCase();
    return hay.includes(s);
  }

  useEffect(() => {
    // close notif dropdown when clicking outside
    function onDoc(e) {
      // nothing for now
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Notification helpers
  const unreadCount = notifications.filter((n) => !n.read).length;
  const toggleNotif = () => {
    setNotifOpen((v) => !v);
    // mark visible ones read when opening
    if (!notifOpen) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  // actions on reservations (demo)
  const updateReservationStatus = (id, newStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    // show notification
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "StatusUpdate",
        title: `Đơn ${id} đã chuyển sang ${newStatus}`,
        detail: `Đã cập nhật trạng thái ${newStatus}`,
        time: "Vừa xong",
        read: false,
        icon: "check-circle",
        iconClass: "text-indigo-600",
      },
      ...prev,
    ]);
  };

  // Open modal for table actions
  const openTableModal = (tableId) => {
    const t = TABLE_LAYOUT[tableId];
    const status = floorData[tableId]?.status || "Available";
    setModalContent({ tableId, ...t, status });
    setModalOpen(true);
  };

  // Render helpers for status colors
  const statusBadge = (status) => {
    switch (status) {
      case "Available":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800";
      case "Reserved":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800";
      case "Occupied":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800";
      case "Pending":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-yellow-50 text-yellow-800";
      case "Confirmed":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-800";
      case "Cancelled":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-800";
      case "Completed":
        return "px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800";
      default:
        return "px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800";
    }
  };

  // MAIN JSX
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6 p-4 bg-white rounded-xl shadow-lg flex justify-between items-center relative">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">🍽️ Quản Lý Đặt Bàn</h1>
            <p className="text-sm text-gray-600">Theo dõi trạng thái thời gian thực và quản lý đơn đặt bàn.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNotif();
                }}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h4 className="font-bold text-gray-800">Thông báo mới</h4>
                    <button
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                      className="text-xs text-indigo-500 hover:text-indigo-600"
                    >
                      Đánh dấu đã đọc
                    </button>
                  </div>
                  <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 && <li className="p-4 text-sm text-gray-500 italic">Không có thông báo</li>}
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition ${!n.read ? "bg-yellow-50" : ""}`}
                        onClick={() => {
                          // open modal-like notification detail
                          setModalContent({ type: "notification", title: n.title, detail: n.detail });
                          setModalOpen(true);
                          // mark it read
                          setNotifications((prev) => prev.map((p) => (p.id === n.id ? { ...p, read: true } : p)));
                        }}
                      >
                        <div className="flex-shrink-0 pt-1">
                          {/* simple icon circle */}
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <span className="text-sm">!</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${!n.read ? "text-gray-900" : "text-gray-700"}`}>{n.title}</p>
                          <p className="text-xs text-gray-500">{n.detail}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 text-center border-t border-gray-100">
                    <button className="text-sm text-indigo-500 hover:text-indigo-600">Xem tất cả</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6 bg-white rounded-t-xl shadow-md overflow-hidden">
          <button
            onClick={() => {
              setActiveTab("floorplan");
              // reset filters if needed
            }}
            className={`p-4 text-center transition duration-200 hover:bg-gray-50 flex-1 ${activeTab === "floorplan" ? "tab-active border-b-4 border-indigo-600 text-indigo-600 font-semibold" : "text-gray-600"}`}
          >
            <span className="inline-flex items-center">
              <LayoutGrid className="w-4 h-4 mr-2" /> Sơ Đồ Bố Trí Bàn
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("upcoming");
              setStatusFilter("All");
              setSearchTerm("");
              setDateFilter("");
            }}
            className={`p-4 text-center transition duration-200 hover:bg-gray-50 flex-1 ${activeTab === "upcoming" ? "tab-active border-b-4 border-indigo-600 text-indigo-600 font-semibold" : "text-gray-600"}`}
          >
            <span className="inline-flex items-center">
              <CalendarCheck className="w-4 h-4 mr-2" /> Quản Lý Đặt Bàn
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("history");
              setStatusFilter("All");
              setSearchTerm("");
              setDateFilter("");
            }}
            className={`p-4 text-center transition duration-200 hover:bg-gray-50 flex-1 ${activeTab === "history" ? "tab-active border-b-4 border-indigo-600 text-indigo-600 font-semibold" : "text-gray-600"}`}
          >
            <span className="inline-flex items-center">
              <HistoryIcon className="w-4 h-4 mr-2" /> Lịch Sử Đặt Bàn
            </span>
          </button>
        </div>

        {/* Panels */}
        <div className="space-y-6">
          {/* Floorplan Panel */}
          {activeTab === "floorplan" && (
            <section className="bg-white/50 p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Trạng Thái Bàn Hiện Tại</h2>
              <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "minmax(120px, auto)" }}>
                {/* Area A - occupies columns 1-2 and rows 1-3 in original -> we approximate */}
                <div className="p-4 rounded-lg border-2 border-indigo-400 bg-indigo-50/70">
                  <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b pb-2">Khu A (Bàn 2 Chỗ)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(TABLE_LAYOUT)
                      .filter((id) => TABLE_LAYOUT[id].area === "A")
                      .map((id) => {
                        const t = floorData[id] || { status: "Available", reservedBy: "" };
                        const status = t.status;
                        return (
                          <div key={id} className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform" onClick={() => openTableModal(id)}>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{id} ({TABLE_LAYOUT[id].seats} chỗ)</h4>
                              <span className={status === "Available" ? "text-green-600" : status === "Reserved" ? "text-yellow-600" : "text-red-600"}>
                                {status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {status !== "Available" ? <><span className="font-medium">Người quản lý:</span> <span className="text-xs font-mono">{t.reservedBy}</span></> : "Sẵn sàng phục vụ"}
                            </p>
                            <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Hành động</button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Area B */}
                <div className="p-4 rounded-lg border-2 border-green-400 bg-green-50/70">
                  <h3 className="text-lg font-bold text-green-800 mb-3 border-b pb-2">Khu B (Bàn 4 Chỗ)</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(TABLE_LAYOUT)
                      .filter((id) => TABLE_LAYOUT[id].area === "B")
                      .map((id) => {
                        const t = floorData[id] || { status: "Available", reservedBy: "" };
                        return (
                          <div key={id} className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform" onClick={() => openTableModal(id)}>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{id} ({TABLE_LAYOUT[id].seats} chỗ)</h4>
                              <span className={t.status === "Available" ? "text-green-600" : t.status === "Reserved" ? "text-yellow-600" : "text-red-600"}>
                                {t.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{t.status !== "Available" ? `Người quản lý: ${t.reservedBy}` : "Sẵn sàng phục vụ"}</p>
                            <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Hành động</button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Area C */}
                <div className="p-4 rounded-lg border-2 border-yellow-400 bg-yellow-50/70">
                  <h3 className="text-lg font-bold text-yellow-800 mb-3 border-b pb-2">Khu C (Bàn 6 Chỗ)</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(TABLE_LAYOUT)
                      .filter((id) => TABLE_LAYOUT[id].area === "C")
                      .map((id) => {
                        const t = floorData[id] || { status: "Available", reservedBy: "" };
                        return (
                          <div key={id} className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform" onClick={() => openTableModal(id)}>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{id} ({TABLE_LAYOUT[id].seats} chỗ)</h4>
                              <span className={t.status === "Available" ? "text-green-600" : t.status === "Reserved" ? "text-yellow-600" : "text-red-600"}>
                                {t.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{t.status !== "Available" ? `Người quản lý: ${t.reservedBy}` : "Sẵn sàng phục vụ"}</p>
                            <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Hành động</button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Service area (bar) */}
                <div className="p-4 rounded-lg border-2 border-gray-400 bg-gray-200/70 flex items-center justify-center col-span-2">
                  <p className="text-xl font-bold text-gray-700">Khu Dịch Vụ / Bar</p>
                </div>
              </div>
            </section>
          )}

          {/* Reservations Panel (Upcoming / Quản lý) */}
          {activeTab === "upcoming" && (
            <section className="bg-white p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Danh Sách Đơn Đặt Bàn (Chờ & Đã Xác Nhận)</h2>

              {/* Filters row */}
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
                <div className="flex-grow relative">
                  <SearchIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo Mã Đặt Bàn, Khách hàng, SĐT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="w-full md:w-56">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg">
                    <option value="All">Lọc theo Trạng Thái</option>
                    <option value="Pending">Chờ Xử Lý</option>
                    <option value="Confirmed">Đã Xác Nhận</option>
                    <option value="Cancelled">Đã Hủy</option>
                    <option value="Completed">Hoàn Tất</option>
                  </select>
                </div>

                <div className="w-full md:w-56">
                  <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐB</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bàn & Số Lượng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời Gian</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUpcoming.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">Không có đơn nào</td>
                      </tr>
                    ) : (
                      filteredUpcoming.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="font-medium">{item.customer}</div>
                            <div className="text-xs text-gray-500">{item.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-mono text-indigo-600">{item.tableId}</span> - {item.pax} Khách
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time} ({item.date.split("-").reverse().join("/")})</td>
                          <td className="px-6 py-4 whitespace-nowrap">{/* status badge */}
                            <span className={statusBadge(item.status)}>{item.status === "Pending" ? "Chờ Xử Lý" : item.status === "Confirmed" ? "Đã Xác Nhận" : item.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {item.status === "Pending" && (
                              <>
                                <button onClick={() => updateReservationStatus(item.id, "Confirmed")} className="px-3 py-1 text-xs font-semibold rounded-lg text-white bg-green-500 hover:bg-green-600 mr-2">Xác nhận</button>
                                <button onClick={() => updateReservationStatus(item.id, "Cancelled")} className="px-3 py-1 text-xs font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600">Từ chối</button>
                              </>
                            )}
                            {item.status === "Confirmed" && (
                              <>
                                <button onClick={() => updateReservationStatus(item.id, "Completed")} className="px-3 py-1 text-xs font-semibold rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 mr-2">Hoàn tất</button>
                                <button onClick={() => updateReservationStatus(item.id, "Cancelled")} className="px-3 py-1 text-xs font-semibold rounded-lg text-white bg-red-400 hover:bg-red-500">Hủy</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination / summary (demo) */}
              <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span>Tìm thấy {filteredUpcoming.length} đơn đặt phù hợp</span>
                <div className="space-x-2">
                  <button className="px-3 py-1 border rounded-lg bg-gray-100 text-gray-500">Trước</button>
                  <span className="px-3 py-1 border rounded-lg bg-indigo-50 text-indigo-600">1</span>
                  <button className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-50 disabled:cursor-not-allowed" disabled>2</button>
                  <button className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-50 disabled:cursor-not-allowed" disabled>Tiếp</button>
                </div>
              </div>
            </section>
          )}

          {/* History Panel */}
          {activeTab === "history" && (
            <section className="bg-white p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Lịch Sử Đặt Bàn (Đã Hủy & Hoàn Tất)</h2>

              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
                <div className="flex-grow relative">
                  <SearchIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="w-full md:w-56">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg">
                    <option value="All">Lọc theo Trạng Thái</option>
                    <option value="Completed">Hoàn Tất</option>
                    <option value="Cancelled">Đã Hủy</option>
                    <option value="Pending">Chờ Xử Lý</option>
                    <option value="Confirmed">Đã Xác Nhận</option>
                  </select>
                </div>

                <div className="w-full md:w-56">
                  <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐB</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bàn & Số Lượng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời Gian</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi Chú</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">Không có lịch sử</td>
                      </tr>
                    ) : (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="font-medium">{item.customer}</div>
                            <div className="text-xs text-gray-500">{item.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-mono text-indigo-600">{item.tableId}</span> - {item.pax} Khách
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time} ({item.date.split("-").reverse().join("/")})</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={statusBadge(item.status)}>{item.status === "Completed" ? "Hoàn Tất" : item.status === "Cancelled" ? "Đã Hủy" : item.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                            {item.status === "Cancelled" ? "Khách hàng hủy" : item.status === "Completed" ? "Đã thanh toán" : ""}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span>Tìm thấy {filteredHistory.length} đơn</span>
                <div className="space-x-2">
                  <button className="px-3 py-1 border rounded-lg bg-gray-100 text-gray-500">Trước</button>
                  <span className="px-3 py-1 border rounded-lg bg-indigo-50 text-indigo-600">1</span>
                  <button className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-50 disabled:cursor-not-allowed" disabled>Tiếp</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modal (shared) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg transform transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {modalContent.type === "notification" ? modalContent.title : `Cập Nhật Trạng Thái Bàn ${modalContent.tableId || ""}`}
                </h3>
                {modalContent.detail && <p className="text-sm text-gray-600 mt-2">{modalContent.detail}</p>}
                {modalContent.tableId && <p className="text-sm text-gray-600 mt-2">Khu: <span className="font-semibold">{modalContent.label}</span> — {modalContent.seats} chỗ</p>}
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}><XCircle className="w-6 h-6" /></button>
            </div>

            <div className="mt-4">
              {/* If table modal, show actions */}
              {modalContent.tableId && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 italic">Mô phỏng: ở đây bạn có thể cập nhật trạng thái, mở form đặt, v.v.</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => {
                      // sample set Reserved for demo
                      setFloorData(prev => ({ ...prev, [modalContent.tableId]: { ...(prev[modalContent.tableId] || {}), status: "Reserved", reservedBy: "Bạn" } }));
                      setModalOpen(false);
                    }}>Đặt Bàn</button>
                    <button className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700" onClick={() => {
                      setFloorData(prev => ({ ...prev, [modalContent.tableId]: { ...(prev[modalContent.tableId] || {}), status: "Occupied" } }));
                      setModalOpen(false);
                    }}>Đánh dấu Đang Dùng</button>
                    <button className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600" onClick={() => {
                      setFloorData(prev => ({ ...prev, [modalContent.tableId]: { ...(prev[modalContent.tableId] || {}), status: "Available", reservedBy: "" } }));
                      setModalOpen(false);
                    }}>Giải phóng</button>
                  </div>
                </div>
              )}

              {/* If notification modal, show OK */}
              {modalContent.type === "notification" && (
                <div className="mt-4 text-right">
                  <button className="px-4 py-2 rounded-md bg-indigo-600 text-white" onClick={() => setModalOpen(false)}>Đóng</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
