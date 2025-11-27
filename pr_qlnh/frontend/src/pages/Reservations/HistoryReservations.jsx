// src/pages/ReservationCenter/HistoryPanel.jsx
import React from "react";
import { Search as SearchIcon } from "lucide-react";

/**
 * HistoryPanel
 * Props:
 *  - filteredReservations: array
 *  - searchTerm,setSearchTerm,statusFilter,setStatusFilter,dateFilter,setDateFilter
 *
 * Pure UI.
 */

export default function HistoryPanel({
  filteredReservations,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Lịch Sử Đặt Bàn (Đã Hủy & Hoàn Tất)</h2>

      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
        <div className="flex-grow relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
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
          {filteredReservations.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">Không có lịch sử</td>
            </tr>
          ) : (
            filteredReservations.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="font-medium">{item.customer}</div>
                  <div className="text-xs text-gray-500">{item.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="font-mono text-indigo-600">{item.tableId}</span> - {item.pax} Khách
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time} ({item.date.split('-').reverse().join('/')})</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.status === "Completed" ? "bg-gray-200 text-gray-800" : item.status === "Cancelled" ? "bg-red-50 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                    {item.status === "Completed" ? "Hoàn Tất" : item.status === "Cancelled" ? "Đã Hủy" : item.status}
                  </span>
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
        <span>Tìm thấy {filteredReservations.length} đơn</span>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded-lg bg-gray-100 text-gray-500">Trước</button>
          <span className="px-3 py-1 border rounded-lg bg-indigo-50 text-indigo-600">1</span>
          <button className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-50 disabled:cursor-not-allowed" disabled>Tiếp</button>
        </div>
      </div>
    </section>
  );
}
