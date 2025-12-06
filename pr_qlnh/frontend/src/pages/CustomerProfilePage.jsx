import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, Shield, Save, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import SecuritySection from "../components/Settings/SecuritySection";

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "security"

  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData({
      full_name: userData.full_name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      username: userData.username || "",
    });
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra. Vui lòng thử lại!" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">
                {user?.full_name || user?.username || "Người dùng"}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-8 py-4 font-semibold transition-all relative ${
                activeTab === "profile"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={20} />
                <span>Thông tin cá nhân</span>
              </div>
              {activeTab === "profile" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-8 py-4 font-semibold transition-all relative ${
                activeTab === "security"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span>Bảo mật</span>
              </div>
              {activeTab === "security" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
          </div>
        </div>

        {/* Message Notification */}
        {message.text && (
          <div
            className={`mb-8 p-4 rounded-lg border-l-4 ${
              message.type === "success"
                ? "bg-gray-50 border-black text-gray-900"
                : "bg-red-50 border-red-600 text-red-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Profile Form */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Chỉnh sửa thông tin</h2>
              <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                      placeholder="0123456789"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Info */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Thông tin tài khoản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-black" size={20} />
                    <p className="text-sm font-bold text-black">Ngày tạo tài khoản</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "N/A"}
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-black" size={20} />
                    <p className="text-sm font-bold text-black">ID người dùng</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">#{user?.user_id || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab Content */}
        {activeTab === "security" && (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Bảo mật tài khoản</h2>
            <SecuritySection user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfilePage;
