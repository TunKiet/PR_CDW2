import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosClient from "../api/axiosClient";
import { notify } from "../utils/notify";

export default function FrequentCustomerReport() {
  const [range, setRange] = useState("month");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchReport = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(
        `/reports/frequent-customers?range=${range}&page=${page}`
      );

      if (res.data?.success === false) {
        notify.error("Lỗi tải báo cáo!");
        return;
      }

      const paginated = res.data.data;

      setCustomers(paginated.data);
      setCurrentPage(paginated.current_page);
      setLastPage(paginated.last_page);
    } catch (err) {
      notify.error("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  // Khi đổi range → reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
    fetchReport(1);
  }, [range]);

  // Khi đổi trang
  useEffect(() => {
    fetchReport(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Báo cáo khách hàng thường xuyên</h2>

          <select
            className="border px-3 py-2 rounded-lg"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-6">Đang tải...</div>
        ) : (
          <>
            <table className="w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Khách hàng</th>
                  <th className="p-3 text-left">Số đơn hàng</th>
                  <th className="p-3 text-left">Số lần đặt bàn</th>
                  <th className="p-3 text-left">Tổng hoạt động</th>
                  <th className="p-3 text-left">Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.user_id} className="border-t">
                    <td className="p-3">{c.username}</td>
                    <td className="p-3">{c.order_count}</td>
                    <td className="p-3">{c.reservation_count}</td>
                    <td className="p-3 font-semibold">{c.activity_score}</td>
                    <td className="p-3 text-green-600">
                      {Number(c.total_spent).toLocaleString()} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PHÂN TRANG */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Trang trước
              </button>

              <span>
                Trang {currentPage} / {lastPage}
              </span>

              <button
                disabled={currentPage === lastPage}
                className="px-4 py-2 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Trang sau
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
