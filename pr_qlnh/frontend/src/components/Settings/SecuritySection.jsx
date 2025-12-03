// src/components/Settings/SecuritySection.jsx
import React, { useState, useEffect } from "react";
import { Lock, Key, Shield, Eye, EyeOff, AlertCircle, CheckCircle, Smartphone, Mail } from "lucide-react";
import { sendOTP, verifyOTP, disable2FA, check2FAStatus } from "../../data/TwoFactorData";

const SecuritySection = ({ user }) => {
  const [activeSection, setActiveSection] = useState("password");
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Load 2FA status khi component mount
  useEffect(() => {
    if (user?.user_id) {
      load2FAStatus();
    }
  }, [user]);

  const load2FAStatus = async () => {
    try {
      const res = await check2FAStatus(user.user_id);
      setTwoFactorEnabled(res.two_factor_enabled || false);
    } catch (err) {
      console.error("Lỗi tải trạng thái 2FA:", err);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccess(false);
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.current_password) {
      newErrors.current_password = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordData.new_password) {
      newErrors.new_password = "Vui lòng nhập mật khẩu mới";
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!passwordData.confirm_password) {
      newErrors.confirm_password = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
    }

    if (passwordData.current_password === passwordData.new_password) {
      newErrors.new_password = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    try {
      // TODO: Call API to change password
      // await changePassword(user.user_id, passwordData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      setErrors({ submit: "Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra!" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const res = await sendOTP(user.user_id, user.email);
      
      setOtpSent(true);
      setShowOTPInput(true);
      setCountdown(60); // 60 seconds countdown
      alert(res.message || `Mã OTP đã được gửi đến email: ${user?.email}`);
    } catch (err) {
      console.error("Lỗi gửi OTP:", err);
      const errorMsg = err.response?.data?.message || "Có lỗi xảy ra khi gửi mã OTP!";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({ verification: "Mã xác thực phải có 6 chữ số" });
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(user.user_id, verificationCode);
      
      setTwoFactorEnabled(true);
      setShowOTPInput(false);
      setVerificationCode("");
      setOtpSent(false);
      setCountdown(0);
      alert(res.message || "Xác thực 2 yếu tố đã được kích hoạt thành công!");
    } catch (err) {
      console.error("Lỗi xác thực 2FA:", err);
      const errorMsg = err.response?.data?.message || "Mã xác thực không đúng!";
      setErrors({ verification: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("Bạn có chắc muốn tắt xác thực 2 yếu tố?")) return;

    setLoading(true);
    try {
      const res = await disable2FA(user.user_id);
      
      setTwoFactorEnabled(false);
      alert(res.message || "Đã tắt xác thực 2 yếu tố!");
    } catch (err) {
      console.error("Lỗi tắt 2FA:", err);
      const errorMsg = err.response?.data?.message || "Có lỗi xảy ra!";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSection("password")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "password"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Key className="inline mr-2" size={16} />
          Đổi mật khẩu
        </button>
        <button
          onClick={() => setActiveSection("2fa")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "2fa"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Shield className="inline mr-2" size={16} />
          Xác thực 2 yếu tố (2FA)
        </button>
      </div>

      {/* Password Change Section */}
      {activeSection === "password" && (
        <div className="space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-green-800 font-medium">
                Đổi mật khẩu thành công!
              </p>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.current_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.new_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.confirm_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Yêu cầu mật khẩu:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tối thiểu 6 ký tự</li>
                <li>• Nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>• Không trùng với mật khẩu hiện tại</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
              >
                <Lock size={18} />
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2FA Section */}
      {activeSection === "2fa" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="font-medium text-blue-900 mb-1">
                  Xác thực 2 yếu tố (2FA)
                </p>
                <p className="text-sm text-blue-800">
                  Tăng cường bảo mật tài khoản bằng cách yêu cầu mã xác thực từ ứng dụng
                  di động khi đăng nhập.
                </p>
              </div>
            </div>
          </div>

          {/* 2FA Status */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    twoFactorEnabled ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Smartphone
                    className={twoFactorEnabled ? "text-green-600" : "text-gray-400"}
                    size={24}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Trạng thái xác thực 2 yếu tố
                  </p>
                  <p className="text-sm text-gray-600">
                    {twoFactorEnabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  twoFactorEnabled
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {twoFactorEnabled ? "Đang bật" : "Đang tắt"}
              </span>
            </div>

            {!twoFactorEnabled && !showOTPInput && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Kích hoạt xác thực 2 yếu tố để bảo vệ tài khoản của bạn tốt hơn. Mã OTP
                  sẽ được gửi đến email <strong>{user?.email}</strong> khi bạn đăng nhập.
                </p>
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  <Shield size={18} />
                  {loading ? "Đang gửi OTP..." : "Kích hoạt 2FA"}
                </button>
              </div>
            )}

            {showOTPInput && !twoFactorEnabled && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Mail className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Mã OTP đã được gửi đến email
                      </p>
                      <p className="text-sm text-blue-800 mt-1">
                        {user?.email}
                      </p>
                      <p className="text-xs text-blue-700 mt-2">
                        Vui lòng kiểm tra hộp thư đến hoặc thư spam
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhập mã OTP (6 chữ số)
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setVerificationCode(value);
                      if (errors.verification) {
                        setErrors({});
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.verification ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="000000"
                    maxLength="6"
                  />
                  {errors.verification && (
                    <p className="text-red-500 text-sm mt-1">{errors.verification}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowOTPInput(false);
                      setVerificationCode("");
                      setOtpSent(false);
                      setCountdown(0);
                      setErrors({});
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || countdown > 0}
                    className="flex-1 px-4 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại OTP"}
                  </button>
                  <button
                    onClick={handleVerify2FA}
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? "Đang xác thực..." : "Xác nhận"}
                  </button>
                </div>
              </div>
            )}

            {twoFactorEnabled && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <p className="text-green-800 font-medium">
                      Xác thực 2 yếu tố đang hoạt động
                    </p>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Tài khoản của bạn được bảo vệ bởi lớp bảo mật bổ sung.
                  </p>
                </div>

                <button
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  <Shield size={18} />
                  {loading ? "Đang xử lý..." : "Tắt 2FA"}
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Hướng dẫn sử dụng 2FA qua Email
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-medium">1.</span>
                <span>Nhấn nút "Kích hoạt 2FA" để nhận mã OTP qua email</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">2.</span>
                <span>Kiểm tra email và lấy mã OTP 6 chữ số</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">3.</span>
                <span>Nhập mã OTP vào ô bên trên và nhấn "Xác nhận"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">4.</span>
                <span>
                  Khi đăng nhập, bạn sẽ nhận mã OTP qua email để xác thực
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">5.</span>
                <span>
                  Mã OTP có hiệu lực trong 5 phút và chỉ sử dụng được 1 lần
                </span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySection;
