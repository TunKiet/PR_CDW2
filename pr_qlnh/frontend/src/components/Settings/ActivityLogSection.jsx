// src/components/Settings/ActivityLogSection.jsx
import React, { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle, XCircle, LogOut, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getUserLoginLogs } from "../../data/LoginLogData";

const ActivityLogSection = ({ user }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Số mục trên mỗi trang

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserLoginLogs(50);

      if (response.success) {
        setLogs(response.data);
      }
    } catch (err) {
      console.error("Lỗi tải nhật ký:", err);
      setError("Không thể tải nhật ký hoạt động. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "failed":
        return <XCircle className="text-red-500" size={20} />;
      case "logout":
        return <LogOut className="text-blue-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Đăng nhập thành công";
      case "failed":
        return "Đăng nhập thất bại";
      case "logout":
        return "Đăng xuất";
      default:
        return status;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "logout":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getSessionDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return null;
    
    const login = new Date(loginTime);
    const logout = new Date(logoutTime);
    const diff = logout - login;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  // Nhóm logs theo phiên đăng nhập
  const groupLogsBySession = () => {
    const sessions = [];
    let currentSession = null;

    logs.forEach((log) => {
      if (log.status === "success") {
        // Bắt đầu phiên mới
        currentSession = {
          loginTime: log.created_at,
          logoutTime: null,
          ipAddress: log.ip_address,
          loginLog: log,
          logoutLog: null,
        };
        sessions.push(currentSession);
      } else if (log.status === "logout" && currentSession) {
        // Kết thúc phiên hiện tại
        currentSession.logoutTime = log.created_at;
        currentSession.logoutLog = log;
        currentSession = null;
      } else if (log.status === "failed") {
        // Log đăng nhập thất bại (hiển thị riêng)
        sessions.push({
          loginTime: log.created_at,
          logoutTime: null,
          ipAddress: log.ip_address,
          loginLog: log,
          logoutLog: null,
          isFailed: true,
        });
      }
    });

    return sessions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-indigo-600" size={32} />
        <span className="ml-3 text-gray-600">Đang tải nhật ký...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
        <AlertCircle className="text-red-500" size={20} />
        <div>
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={fetchLogs}
            className="text-red-600 hover:text-red-700 text-sm underline mt-1"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const sessions = groupLogsBySession();

  // Tính toán phân trang
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = sessions.slice(indexOfFirstItem, indexOfLastItem);

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Nhật ký hoạt động
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Lịch sử đăng nhập và đăng xuất của tài khoản ({sessions.length} phiên)
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-green-700">Đăng nhập thành công</p>
              <p className="text-2xl font-bold text-green-900">
                {logs.filter((l) => l.status === "success").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-red-700">Đăng nhập thất bại</p>
              <p className="text-2xl font-bold text-red-900">
                {logs.filter((l) => l.status === "failed").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LogOut className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-blue-700">Tổng số phiên</p>
              <p className="text-2xl font-bold text-blue-900">
                {sessions.filter((s) => !s.isFailed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Clock className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-600 mt-4">Chưa có nhật ký hoạt động</p>
          </div>
        ) : (
          currentSessions.map((session, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                session.isFailed
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200 hover:border-indigo-300"
              } transition`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(session.loginLog.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {getStatusText(session.loginLog.status)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          session.loginLog.status
                        )}`}
                      >
                        {session.loginLog.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>
                          Đăng nhập: {formatDateTime(session.loginTime)}
                        </span>
                      </div>

                      {session.logoutTime && (
                        <>
                          <div className="flex items-center gap-2">
                            <LogOut size={14} />
                            <span>
                              Đăng xuất: {formatDateTime(session.logoutTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-indigo-600">
                            <Clock size={14} />
                            <span>
                              Thời gian: {getSessionDuration(session.loginTime, session.logoutTime)}
                            </span>
                          </div>
                        </>
                      )}

                      {!session.logoutTime && !session.isFailed && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="font-medium">Phiên đang hoạt động</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>IP: {session.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {sessions.length > itemsPerPage && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-600">
            Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sessions.length)} trong tổng số {sessions.length} phiên
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg border transition flex items-center gap-1 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Hiển thị trang đầu, trang cuối, trang hiện tại và 2 trang xung quanh
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg border transition ${
                        currentPage === pageNumber
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg border transition flex items-center gap-1 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-blue-600 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Lưu ý về nhật ký hoạt động:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Hệ thống ghi lại mọi lần đăng nhập và đăng xuất</li>
              <li>Địa chỉ IP được lưu để theo dõi vị trí truy cập</li>
              <li>Nếu phát hiện hoạt động bất thường, vui lòng đổi mật khẩu ngay</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogSection;
