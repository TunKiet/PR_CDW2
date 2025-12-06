import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  RefreshCw, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowLeft,
  Calendar
} from "lucide-react";
import { getUserLoginLogs } from "../data/LoginLogData";

const CustomerActivityLogPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchLogs();
  }, [navigate]);

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
        currentSession = {
          loginTime: log.created_at,
          logoutTime: null,
          ipAddress: log.ip_address,
          loginLog: log,
          logoutLog: null,
        };
        sessions.push(currentSession);
      } else if (log.status === "logout" && currentSession) {
        currentSession.logoutTime = log.created_at;
        currentSession.logoutLog = log;
        currentSession = null;
      } else if (log.status === "failed") {
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

  const sessions = groupLogsBySession();

  // Pagination
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = sessions.slice(indexOfFirstItem, indexOfLastItem);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-indigo-600 mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Đang tải nhật ký...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại trang chủ
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nhật ký hoạt động</h1>
              <p className="text-gray-600 mt-2">
                Lịch sử đăng nhập và đăng xuất của tài khoản ({sessions.length} phiên)
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              <RefreshCw size={16} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 mb-6">
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
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đăng nhập thành công</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.filter((l) => l.status === "success").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đăng nhập thất bại</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.filter((l) => l.status === "failed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <LogOut className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng số phiên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter((s) => !s.isFailed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3 mb-6">
          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Clock className="mx-auto text-gray-400" size={48} />
              <p className="text-gray-600 mt-4">Chưa có nhật ký hoạt động</p>
            </div>
          ) : (
            currentSessions.map((session, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm p-6 border transition hover:shadow-md ${
                  session.isFailed
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(session.loginLog.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
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

                      <div className="space-y-2 text-sm text-gray-600">
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
                            <div className="flex items-center gap-2 text-indigo-600 font-medium">
                              <Clock size={14} />
                              <span>
                                Thời gian: {getSessionDuration(session.loginTime, session.logoutTime)}
                              </span>
                            </div>
                          </>
                        )}

                        {!session.logoutTime && !session.isFailed && (
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Phiên đang hoạt động</span>
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
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
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
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Lưu ý về nhật ký hoạt động:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Hệ thống ghi lại mọi lần đăng nhập và đăng xuất của bạn</li>
                <li>Địa chỉ IP được lưu để theo dõi vị trí truy cập</li>
                <li>Nếu phát hiện hoạt động bất thường, vui lòng đổi mật khẩu ngay</li>
                <li>Bạn có thể xem lịch sử đăng nhập trong 30 ngày gần nhất</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerActivityLogPage;
