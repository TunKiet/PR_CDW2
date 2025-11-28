// src/components/Settings/ProfileSection.jsx
import React, { useState, useEffect } from "react";
import { Save, User, Mail, Phone, AlertCircle } from "lucide-react";

const ProfileSection = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccess(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Họ và tên không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Call API to update profile
      const userId = user?.user_id || user?.id;
      // await updateUserProfile(userId, formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setSuccess(true);
      if (onUpdate) onUpdate();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      setErrors({ submit: "Có lỗi xảy ra. Vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <p className="text-green-800 font-medium">
            Cập nhật thông tin thành công!
          </p>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline mr-2" size={16} />
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập họ và tên"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline mr-2" size={16} />
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline mr-2" size={16} />
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0123456789"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Account Info (Read-only) */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">Thông tin tài khoản</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ID người dùng</p>
              <p className="font-medium text-gray-900">
                {user?.user_id || user?.id || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Vai trò</p>
              <p className="font-medium text-gray-900">
                {user?.roles || "Customer"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Trạng thái</p>
              <p className="font-medium">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user?.status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user?.status === 1 ? "Đang hoạt động" : "Vô hiệu hóa"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">Ngày tạo</p>
              <p className="font-medium text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("vi-VN")
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
          >
            <Save size={18} />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
