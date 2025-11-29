import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, User } from "lucide-react";
import { checkIn, checkOut, getTodayStatus } from "../data/attendanceApi";

const AttendanceCheckIn = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [todayStatus, setTodayStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Kiểm tra trạng thái chấm công hôm nay
  const checkTodayStatus = async (id) => {
    try {
      const response = await getTodayStatus(id);
      if (response.success) {
        setTodayStatus(response);
      }
    } catch (error) {
      console.error("Error checking today status:", error);
    }
  };

  // Xử lý chấm công vào
  const handleCheckIn = async () => {
    if (!userId.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập User ID" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await checkIn(userId);
      if (response.success) {
        setMessage({ type: "success", text: response.message });
        await checkTodayStatus(userId);
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra khi chấm công vào",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chấm công ra
  const handleCheckOut = async () => {
    if (!userId.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập User ID" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await checkOut(userId);
      if (response.success) {
        setMessage({ type: "success", text: response.message });
        await checkTodayStatus(userId);
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra khi chấm công ra",
      });
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra trạng thái khi nhập User ID
  const handleUserIdChange = (e) => {
    const id = e.target.value;
    setUserId(id);
    if (id.trim()) {
      checkTodayStatus(id);
    } else {
      setTodayStatus(null);
    }
  };

  // Format thời gian
  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chấm Công
          </h1>
          <p className="text-gray-600">{formatDate(currentTime)}</p>
          <p className="text-4xl font-bold text-indigo-600 mt-2">
            {formatTime(currentTime)}
          </p>
        </div>

        {/* Form nhập User ID */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            User ID
          </label>
          <input
            type="number"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Nhập User ID của bạn"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            disabled={loading}
          />
        </div>

        {/* Hiển thị thông tin nhân viên và trạng thái */}
        {todayStatus && todayStatus.user && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              Nhân viên: {todayStatus.user.full_name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{todayStatus.user.email}</p>
            {todayStatus.data && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <p className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Giờ vào: {todayStatus.data.check_in || "Chưa chấm"}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      todayStatus.data.status === "present"
                        ? "bg-green-100 text-green-800"
                        : todayStatus.data.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : todayStatus.data.status === "half_day"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {todayStatus.data.status === "present"
                      ? "Đúng giờ"
                      : todayStatus.data.status === "late"
                      ? "Đi muộn"
                      : todayStatus.data.status === "half_day"
                      ? "Nửa ngày"
                      : "Vắng"}
                  </span>
                </div>
                <p className="flex items-center text-gray-700">
                  {todayStatus.data.check_out ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  Giờ ra: {todayStatus.data.check_out || "Chưa chấm"}
                </p>
                {todayStatus.data.hours_worked > 0 && (
                  <div className="pt-2 border-t border-blue-200">
                    <p className="font-semibold text-indigo-600">
                      Số giờ làm: {todayStatus.data.hours_worked} giờ
                      {todayStatus.data.hours_worked >= 8 && (
                        <span className="ml-2 text-green-600">✓ Đủ giờ</span>
                      )}
                    </p>
                  </div>
                )}
                {todayStatus.data.note && (
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-xs text-gray-600">
                      <strong>Ghi chú:</strong> {todayStatus.data.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Thông báo */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <p className="flex items-center">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCheckIn}
            disabled={loading || todayStatus?.has_checked_in}
            className={`py-3 px-6 rounded-lg font-semibold transition-all ${
              loading || todayStatus?.has_checked_in
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Đang xử lý..." : "Chấm Vào"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={
              loading ||
              !todayStatus?.has_checked_in ||
              todayStatus?.has_checked_out
            }
            className={`py-3 px-6 rounded-lg font-semibold transition-all ${
              loading ||
              !todayStatus?.has_checked_in ||
              todayStatus?.has_checked_out
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Đang xử lý..." : "Chấm Ra"}
          </button>
        </div>

        {/* Quy định chấm công */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">
              ⏰ Giờ làm việc
            </h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Vào: 8:00 AM</li>
              <li>• Ra: 5:30 PM</li>
              <li>• Nghỉ trưa: 12:00 - 1:00 PM</li>
              <li>• Tổng: 8 giờ/ngày</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
              ⚠️ Lưu ý
            </h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Đi muộn: sau 8:15 AM</li>
              <li>• Về sớm: trước 5:15 PM</li>
              <li>• Tối thiểu: 4 giờ làm việc</li>
              <li>• Chấm công: 6:00 AM - 12:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Hướng dẫn */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2 text-sm">
            📋 Hướng dẫn:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Nhập User ID của bạn (số)</li>
            <li>• Nhấn "Chấm Vào" khi bắt đầu làm việc</li>
            <li>• Nhấn "Chấm Ra" khi kết thúc làm việc</li>
            <li>• Hệ thống tự động trừ 1 giờ nghỉ trưa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCheckIn;
