import React from "react";
import { Search } from "lucide-react";

export default function ReservationsHistory({
  reservations,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  statusBadge,
}) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Lịch Sử Đặt Bàn (Đã Hủy & Hoàn Tất)
      </h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Tìm kiếm theo khách hàng hoặc mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg"
          >
            <option value="All">Lọc theo Trạng Thái</option>
            <option value="Completed">Hoàn Tất</option>
            <option value="Cancelled">Đã Hủy</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <input
            type="date"
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Mã ĐB</Th>
              <Th>Khách Hàng</Th>
              <Th>Bàn & Số Lượng</Th>
              <Th>Thời Gian</Th>
              <Th>Trạng Thái</Th>
              <Th>Ghi Chú</Th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center italic text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              reservations.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <Td bold>{item.id}</Td>

                  <Td>
                    {item.customer}
                    <div className="text-xs text-gray-500">{item.phone}</div>
                  </Td>

                  <Td>
                    <span className="font-mono text-indigo-600">{item.tableId}</span> — {item.pax} khách
                  </Td>

                  <Td>
                    {item.time} ({item.date.split("-").reverse().join("/")})
                  </Td>

                  <Td>
                    <span className={statusBadge(item.status)}>
                      {item.status === "Completed" ? "Hoàn Tất" : "Đã Hủy"}
                    </span>
                  </Td>

                  <Td italic>
                    {item.status === "Cancelled" && "Khách hủy"}
                    {item.status === "Completed" && "Đã thanh toán"}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({ children, bold, italic }) {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm ${
        bold ? "font-semibold text-gray-900" : italic ? "italic text-gray-500" : "text-gray-700"
      }`}
    >
      {children}
    </td>
  );
}
