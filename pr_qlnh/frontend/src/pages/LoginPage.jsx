import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Validate login
 const loginSchema = Yup.object({
  phone: Yup.string()
    .required("Vui lòng nhập email hoặc số điện thoại")
    .test(
      "is-valid-phone-or-email",
      "Phải là số điện thoại (10–11 số) hoặc email hợp lệ",
      (value) =>
        /^[0-9]{10,11}$/.test(value) ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu ít nhất 6 ký tự"),
});


  // Validate register
  const registerSchema = Yup.object({
    fullName: Yup.string().required("Vui lòng nhập họ tên"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  // Đăng nhập
  const loginFormik = useFormik({
    initialValues: { phone: "", password: "", rememberMe: false },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        // Kiểm tra người dùng nhập email hay số điện thoại
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.phone);

        const payload = {
          password: values.password,
          remember: values.rememberMe,
        };

        // Nếu là email thì gửi key là "email", ngược lại là "phone"
        if (isEmail) {
          payload.email = values.phone;
        } else {
          payload.phone = values.phone;
        }

        const res = await axios.post(
          "http://localhost:8000/api/login",
          payload
        );

        alert(res.data.message);
        if (res.data.user.role === "admin") navigate("/admin/dashboard");
        else navigate("/order-page");
      } catch (err) {
        const msg = err.response?.data?.message || "Đăng nhập thất bại!";
        alert(msg);
      }k
    },
  });

  // Đăng ký
  const registerFormik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await axios.post("http://localhost:8000/api/register", {
          full_name: values.fullName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        });
        alert(res.data.message || "Đăng ký thành công!");
        resetForm();
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Có lỗi xảy ra khi đăng ký, vui lòng thử lại!"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("login")}
            className={`tab ${activeTab === "login" ? "tab-active" : ""}`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`tab ${activeTab === "register" ? "tab-active" : ""}`}
          >
            Đăng ký
          </button>
        </div>

        <h1 className="title">
          {activeTab === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
        </h1>

        {/* --- FORM LOGIN --- */}
        {activeTab === "login" && (
          <form onSubmit={loginFormik.handleSubmit} className="form">
            {/* Phone */}
            <div className="form-group">
              <label className="label">Số điện thoại hoặc Email</label>
              <input
                type="text"
                name="phone"
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                value={loginFormik.values.phone}
                placeholder="Nhập số điện thoại hoặc email của bạn"
                className={`input ${
                  loginFormik.touched.phone && loginFormik.errors.phone
                    ? "input-error"
                    : ""
                }`}
              />
              {loginFormik.touched.phone && loginFormik.errors.phone && (
                <p className="error">{loginFormik.errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="label">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  value={loginFormik.values.password}
                  placeholder="Nhập mật khẩu"
                  className={`input ${
                    loginFormik.touched.password && loginFormik.errors.password
                      ? "input-error"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {loginFormik.touched.password && loginFormik.errors.password && (
                <p className="error">{loginFormik.errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="extra-options">
              <label className="remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  onChange={loginFormik.handleChange}
                  checked={loginFormik.values.rememberMe}
                />
                Ghi nhớ mật khẩu
              </label>
              <button
                type="button"
                className="forgot-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loginFormik.isSubmitting}
            >
              {loginFormik.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        )}

        {/* --- FORM REGISTER --- */}
        {activeTab === "register" && (
          <form onSubmit={registerFormik.handleSubmit} className="form">
            {/* Full name */}
            <div className="form-group">
              <label className="label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.fullName}
                placeholder="Nhập họ và tên"
                className={`input ${
                  registerFormik.touched.fullName &&
                  registerFormik.errors.fullName
                    ? "input-error"
                    : ""
                }`}
              />
              {registerFormik.touched.fullName &&
                registerFormik.errors.fullName && (
                  <p className="error">{registerFormik.errors.fullName}</p>
                )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="text"
                name="email"
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.email}
                placeholder="example@gmail.com"
                className={`input ${
                  registerFormik.touched.email && registerFormik.errors.email
                    ? "input-error"
                    : ""
                }`}
              />
              {registerFormik.touched.email && registerFormik.errors.email && (
                <p className="error">{registerFormik.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.phone}
                placeholder="Nhập số điện thoại"
                className={`input ${
                  registerFormik.touched.phone && registerFormik.errors.phone
                    ? "input-error"
                    : ""
                }`}
              />
              {registerFormik.touched.phone && registerFormik.errors.phone && (
                <p className="error">{registerFormik.errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="label">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={registerFormik.handleChange}
                  onBlur={registerFormik.handleBlur}
                  value={registerFormik.values.password}
                  placeholder="Tối thiểu 8 ký tự"
                  className={`input ${
                    registerFormik.touched.password &&
                    registerFormik.errors.password
                      ? "input-error"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {registerFormik.touched.password &&
                registerFormik.errors.password && (
                  <p className="error">{registerFormik.errors.password}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="label">Xác nhận mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={registerFormik.handleChange}
                  onBlur={registerFormik.handleBlur}
                  value={registerFormik.values.confirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  className={`input ${
                    registerFormik.touched.confirmPassword &&
                    registerFormik.errors.confirmPassword
                      ? "input-error"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {registerFormik.touched.confirmPassword &&
                registerFormik.errors.confirmPassword && (
                  <p className="error">
                    {registerFormik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={registerFormik.isSubmitting}
            >
              {registerFormik.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
