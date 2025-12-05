import React, { useState } from "react";
import { Download, Calendar, FileSpreadsheet, X } from "lucide-react";
import axiosClient from "../api/axiosClient";

const AttendanceExport = ({ isOpen, onClose }) => {
  const [exportType, setExportType] = useState("date"); // date, month, range
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    try {
      let url = "";
      let params = {};

      switch (exportType) {
        case "date":
          url = "/attendance/export/by-date";
          params = { date: selectedDate };
          break;
        case "month":
          url = "/attendance/export/by-month";
          params = { month: selectedMonth, year: selectedYear };
          break;
        case "range":
          url = "/attendance/export/by-range";
          params = { start_date: startDate, end_date: endDate };
          break;
        default:
          return;
      }

      // Gọi API và download file
      const response = await axiosClient.get(url, {
        params,
        responseType: "blob", // Quan trọng: nhận file binary
      });

      // Tạo URL để download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Tạo tên file
      let fileName = "Bao_cao_cham_cong";
      if (exportType === "date") {
        fileName += `_ngay_${selectedDate.replace(/-/g, "")}`;
      } else if (exportType === "month") {
        fileName += `_thang_${selectedMonth}_${selectedYear}`;
      } else {
        fileName += `_${startDate}_den_${endDate}`;
      }
      fileName += ".xlsx";

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      alert("Xuất báo cáo thành công!");
      onClose();
    } catch (error) {
      console.error("Error exporting:", error);
      alert(
        `Lỗi xuất báo cáo: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const isValidForm = () => {
    if (exportType === "date") return selectedDate;
    if (exportType === "month") return selectedMonth && selectedYear;
    if (exportType === "range") return startDate && endDate;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-green-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              Xuất Báo Cáo Chấm Công
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Export Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chọn loại báo cáo
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setExportType("date")}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === "date"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              <Calendar className="mx-auto mb-2" size={24} />
              <div className="font-semibold">Theo ngày</div>
            </button>
            <button
              onClick={() => setExportType("month")}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === "month"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              <Calendar className="mx-auto mb-2" size={24} />
              <div className="font-semibold">Theo tháng</div>
            </button>
            <button
              onClick={() => setExportType("range")}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === "range"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              <Calendar className="mx-auto mb-2" size={24} />
              <div className="font-semibold">Khoảng thời gian</div>
            </button>
          </div>
        </div>

        {/* Date Selection */}
        {exportType === "date" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn ngày
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Month Selection */}
        {exportType === "month" && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        {/* Range Selection */}
        {exportType === "range" && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> File Excel sẽ được tải xuống tự động sau khi
            xuất báo cáo thành công. Báo cáo bao gồm thông tin chi tiết về giờ
            vào, giờ ra, số giờ làm việc và trạng thái của từng nhân viên.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={!isValidForm() || loading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang xuất...
              </>
            ) : (
              <>
                <Download size={20} />
                Xuất Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceExport;
