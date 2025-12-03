import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Download,
} from "lucide-react";
import {
  getMonthlyAttendance,
  getAllAttendances,
  getAttendanceReport,
  deleteAttendance,
} from "../data/attendanceApi";

const AttendanceManagement = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("calendar"); // calendar, list, report
  const [allAttendances, setAllAttendances] = useState([]);
  const [report, setReport] = useState(null);

  // Lấy danh sách chấm công theo tháng
  const fetchMonthlyAttendance = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      const response = await getMonthlyAttendance(
        selectedUserId,
        currentMonth,
        currentYear
      );
      if (response.success) {
        setAttendances(response.data);
        setSummary(response.summary);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả chấm công
  const fetchAllAttendances = async () => {
    setLoading(true);
    try {
      const response = await getAllAttendances({
        month: currentMonth,
        year: currentYear,
      });
      if (response.success) {
        setAllAttendances(response.data);
      }
    } catch (error) {
      console.error("Error fetching all attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy báo cáo tổng hợp
  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceReport(currentMonth, currentYear);
      if (response.success) {
        setReport(response);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "calendar" && selectedUserId) {
      fetchMonthlyAttendance();
    } else if (viewMode === "list") {
      fetchAllAttendances();
    } else if (viewMode === "report") {
      fetchReport();
    }
  }, [currentMonth, currentYear, selectedUserId, viewMode]);

  // Chuyển tháng
  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Lấy số ngày trong tháng
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  // Lấy ngày đầu tiên của tháng (0 = CN, 1 = T2, ...)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // Tạo lịch tháng
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const calendar = [];

    // Thêm các ô trống cho ngày đầu tháng
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const attendance = attendances.find((a) => a.date === dateStr);
      calendar.push({ day, attendance });
    }

    return calendar;
  };

  // Xóa chấm công
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi này?")) return;

    try {
      const response = await deleteAttendance(id);
      if (response.success) {
        alert(response.message);
        if (viewMode === "list") {
          fetchAllAttendances();
        } else {
          fetchMonthlyAttendance();
        }
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa");
    }
  };

  // Render lịch tháng
  const renderCalendar = () => {
    const calendar = generateCalendar();
    const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header lịch */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Các ngày trong tháng */}
        <div className="grid grid-cols-7 gap-2">
          {calendar.map((item, index) => (
            <div
              key={index}
              className={`min-h-24 border rounded-lg p-2 ${
                item
                  ? item.attendance
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-200"
                  : "bg-gray-50"
              }`}
            >
              {item && (
                <>
                  <div className="font-semibold text-gray-700 mb-1">
                    {item.day}
                  </div>
                  {item.attendance && (
                    <div className="text-xs space-y-1">
                      <div className="text-green-600 font-medium">
                        ✓ Có mặt
                      </div>
                      <div className="text-gray-600">
                        Vào: {item.attendance.check_in?.substring(0, 5)}
                      </div>
                      {item.attendance.check_out && (
                        <div className="text-gray-600">
                          Ra: {item.attendance.check_out?.substring(0, 5)}
                        </div>
                      )}
                      <div className="text-indigo-600 font-semibold">
                        {item.attendance.hours_worked}h
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Tổng kết */}
        {summary && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.work_days}
              </div>
              <div className="text-sm text-gray-600">Ngày làm việc</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.total_hours}h
              </div>
              <div className="text-sm text-gray-600">Tổng giờ làm</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.average_hours_per_day}h
              </div>
              <div className="text-sm text-gray-600">Trung bình/ngày</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render danh sách
  const renderList = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nhân viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giờ vào
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giờ ra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số giờ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allAttendances.map((attendance) => (
              <tr key={attendance.attendance_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {attendance.user?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {attendance.employee_code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(attendance.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {attendance.check_in?.substring(0, 5)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {attendance.check_out?.substring(0, 5) || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                  {attendance.hours_worked}h
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      attendance.status === "present"
                        ? "bg-green-100 text-green-800"
                        : attendance.status === "absent"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {attendance.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleDelete(attendance.attendance_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render báo cáo
  const renderReport = () => {
    if (!report) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Báo cáo tháng {report.month}/{report.year}
        </h3>
        <div className="space-y-4">
          {report.data.map((employee) => (
            <div
              key={employee.user_id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {employee.full_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Mã NV: {employee.employee_code}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {employee.email}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {employee.total_hours}h
                  </div>
                  <div className="text-sm text-gray-600">Tổng giờ làm</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <div className="font-semibold text-blue-600">
                    {employee.work_days}
                  </div>
                  <div className="text-gray-600">Ngày làm</div>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="font-semibold text-green-600">
                    {employee.average_hours_per_day}h
                  </div>
                  <div className="text-gray-600">TB/ngày</div>
                </div>
                <div className="bg-purple-50 rounded p-2 text-center">
                  <div className="font-semibold text-purple-600">
                    {employee.roles.join(", ")}
                  </div>
                  <div className="text-gray-600">Vai trò</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-indigo-600" />
              Quản Lý Chấm Công
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "calendar"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Lịch
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Danh sách
              </button>
              <button
                onClick={() => setViewMode("report")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "report"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Báo cáo
              </button>
            </div>
          </div>

          {/* Điều hướng tháng */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-700">
              Tháng {currentMonth}/{currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Chọn nhân viên (chỉ hiển thị ở chế độ lịch) */}
          {viewMode === "calendar" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn nhân viên:
              </label>
              <input
                type="number"
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="Nhập User ID"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Nội dung */}
        {loading ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {viewMode === "calendar" && renderCalendar()}
            {viewMode === "list" && renderList()}
            {viewMode === "report" && renderReport()}
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;
