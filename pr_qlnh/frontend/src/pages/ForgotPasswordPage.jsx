import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/password/forgot", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/password/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/password/reset", {
        email,
        otp,
        password,
        password_confirmation: confirmPassword,
      });
      setMessage(res.data.message);
      setStep(4);
    } catch (err) {
      setMessage(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="form">
            <h2 className="title">Quên mật khẩu</h2>
            <input
              className="input"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
             <button
                type="button"
                className="forgot-btn"
                onClick={() => navigate("/")}
              >
                Quay lại đăng nhập
              </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="form">
            <h2 className="title">Nhập mã OTP</h2>
            <input
              className="input"
              type="text"
              placeholder="Nhập mã OTP 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang kiểm tra..." : "Xác minh OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="form">
            <h2 className="title">Đặt lại mật khẩu</h2>
            <input
              className="input"
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang đặt lại..." : "Xác nhận"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <h3>{message}</h3>
            <button className="btn btn-primary" onClick={() => (window.location.href = "/login")}>
              Quay lại đăng nhập
            </button>
          </div>
        )}

        {message && (
          <p style={{ color: step === 4 ? "green" : "red", textAlign: "center", marginTop: 10 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
