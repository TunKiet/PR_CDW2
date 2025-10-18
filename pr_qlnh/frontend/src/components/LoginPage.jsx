import { useState } from "react";
import "./LoginPage.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Schema cho đăng nhập
  const loginSchema = Yup.object({
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại phải 10-11 chữ số"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu ít nhất 6 ký tự"),
  });

  // ✅ Schema cho đăng ký
  const registerSchema = Yup.object({
    fullName: Yup.string().required("Vui lòng nhập họ tên"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại phải 10-11 chữ số"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải tối thiểu 8 ký tự"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const loginFormik = useFormik({
    initialValues: { phone: "", password: "", rememberMe: false },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      alert(`Đăng nhập thành công: ${values.phone}`);
    },
  });

  const registerFormik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      alert(`Đăng ký thành công: ${values.email}`);
    },
  });

  const handleGoogleLogin = () => {
    alert("Chức năng đăng nhập bằng Google (chưa kích hoạt)");
  };

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
            <div className="form-group">
              <label className="label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                value={loginFormik.values.phone}
                placeholder="Nhập số điện thoại"
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
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              {loginFormik.touched.password && loginFormik.errors.password && (
                <p className="error">{loginFormik.errors.password}</p>
              )}
            </div>

            <div className="form-footer">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  onChange={loginFormik.handleChange}
                  checked={loginFormik.values.rememberMe}
                  className="checkbox"
                />
                <span>Ghi nhớ mật khẩu</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Chức năng quên mật khẩu")}
                className="link"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="btn btn-primary">
              Đăng nhập
            </button>
          </form>
        )}

        {/* --- FORM REGISTER --- */}
        {activeTab === "register" && (
          <form onSubmit={registerFormik.handleSubmit} className="form">
            <div className="form-group">
              <label className="label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.fullName}
                placeholder="Nguyễn Văn A"
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
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              {registerFormik.touched.password &&
                registerFormik.errors.password && (
                  <p className="error">{registerFormik.errors.password}</p>
                )}
            </div>

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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              {registerFormik.touched.confirmPassword &&
                registerFormik.errors.confirmPassword && (
                  <p className="error">
                    {registerFormik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <button type="submit" className="btn btn-primary">
              Đăng ký
            </button>
          </form>
        )}

        <div className="divider">
          <span>Hoặc</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn btn-google">
          <FontAwesomeIcon icon={faGoogle} className="google-icon" />
          {activeTab === "login"
            ? " Đăng nhập bằng Google"
            : " Đăng ký bằng Google"}
        </button>
      </div>
    </div>
  );
}
