import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import "./css/ForgotPassword.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ====== STEP 1: GỬI OTP ======
  const step1Formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setMessage("");
      try {
        const res = await axios.post("http://localhost:8000/api/forgot-password", {
          email: values.email,
        });
        setEmail(values.email);
        setMessage("OTP đã được gửi tới email của bạn!");
        setStep(2);
      } catch (err) {
        setError("Không thể gửi OTP. Kiểm tra lại email hoặc thử lại sau!");
        console.log(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ====== STEP 2: NHẬP OTP ======
  const step2Formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, "OTP gồm 6 số").required("Vui lòng nhập OTP"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setMessage("");
      try {
        const res = await axios.post("http://localhost:8000/api/verify-otp", {
          email,
          otp: values.otp,
        });
        setMessage("Xác thực OTP thành công!");
        setStep(3);
      } catch (err) {
        setError("OTP không hợp lệ hoặc đã hết hạn!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ====== STEP 3: ĐẶT LẠI MẬT KHẨU ======
  const step3Formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Nhập mật khẩu mới"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Xác nhận mật khẩu"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setError("");
      setMessage("");
      try {
        const res = await axios.post("http://localhost:8000/api/reset-password", {
          email,
          otp: step2Formik.values.otp,
          password: values.password,
          password_confirmation: values.confirmPassword,
        });
        setMessage("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
        resetForm();
        setStep(1);
      } catch (err) {
        setError("Không thể đặt lại mật khẩu. Vui lòng thử lại!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Quên mật khẩu</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={step1Formik.handleSubmit} className="form">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={step1Formik.handleChange}
              onBlur={step1Formik.handleBlur}
              value={step1Formik.values.email}
              placeholder="example@gmail.com"
              className={`input ${step1Formik.touched.email && step1Formik.errors.email ? "input-error" : ""}`}
            />
            {step1Formik.touched.email && step1Formik.errors.email && (
              <p className="error">{step1Formik.errors.email}</p>
            )}
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={step1Formik.isSubmitting}>
              {step1Formik.isSubmitting ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={step2Formik.handleSubmit} className="form">
            <label>Nhập mã OTP (6 số)</label>
            <input
              type="text"
              name="otp"
              onChange={step2Formik.handleChange}
              onBlur={step2Formik.handleBlur}
              value={step2Formik.values.otp}
              placeholder="Nhập OTP"
              className={`input ${step2Formik.touched.otp && step2Formik.errors.otp ? "input-error" : ""}`}
            />
            {step2Formik.touched.otp && step2Formik.errors.otp && (
              <p className="error">{step2Formik.errors.otp}</p>
            )}
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={step2Formik.isSubmitting}>
              {step2Formik.isSubmitting ? "Đang xác thực..." : "Xác thực OTP"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={step3Formik.handleSubmit} className="form">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="password"
              onChange={step3Formik.handleChange}
              onBlur={step3Formik.handleBlur}
              value={step3Formik.values.password}
              placeholder="Nhập mật khẩu mới"
              className={`input ${step3Formik.touched.password && step3Formik.errors.password ? "input-error" : ""}`}
            />
            {step3Formik.touched.password && step3Formik.errors.password && (
              <p className="error">{step3Formik.errors.password}</p>
            )}

            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={step3Formik.handleChange}
              onBlur={step3Formik.handleBlur}
              value={step3Formik.values.confirmPassword}
              placeholder="Nhập lại mật khẩu"
              className={`input ${
                step3Formik.touched.confirmPassword && step3Formik.errors.confirmPassword ? "input-error" : ""
              }`}
            />
            {step3Formik.touched.confirmPassword && step3Formik.errors.confirmPassword && (
              <p className="error">{step3Formik.errors.confirmPassword}</p>
            )}

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={step3Formik.isSubmitting}>
              {step3Formik.isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <a href="/" className="back-link">
            ← Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
