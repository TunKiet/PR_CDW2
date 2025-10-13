// LoginPage.jsx
import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', loginData);
    alert(`Đăng nhập với email: ${loginData.email}`);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    console.log('Register submitted:', registerData);
    alert(`Đăng ký thành công với email: ${registerData.email}`);
  };

  const handleGoogleLogin = () => {
    alert('Chức năng đăng nhập Google');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab('login')}
            className={`tab ${activeTab === 'login' ? 'tab-active' : ''}`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`tab ${activeTab === 'register' ? 'tab-active' : ''}`}
          >
            Đăng ký
          </button>
        </div>

        {/* Title */}
        <h1 className="title">
          {activeTab === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
        </h1>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="form">
            <div className="form-group">
              <label className="label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={loginData.phone}
                onChange={handleLoginChange}
                placeholder="Nhập số điện thoại ở đây"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Mật khẩu của bạn"
                className="input"
              />
            </div>

            <div className="form-footer">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={loginData.rememberMe}
                  onChange={handleLoginChange}
                  className="checkbox"
                />
                <span>Ghi nhớ mật khẩu</span>
              </label>
              <button onClick={() => alert('Chức năng quên mật khẩu')} className="link">
                Quên mật khẩu?
              </button>
            </div>

            <button onClick={handleLoginSubmit} className="btn btn-primary">
              Đăng nhập
            </button>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="form">
            <div className="form-group">
              <label className="label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={registerData.fullName}
                onChange={handleRegisterChange}
                placeholder="Nguyễn Văn A"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder="Nhập số điện thoại"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="Tối thiểu 8 ký tự"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Nhập lại mật khẩu"
                className="input"
              />
            </div>

            <button onClick={handleRegisterSubmit} className="btn btn-primary">
              Đăng ký
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="divider">
          <span>Hoặc</span>
        </div>

        {/* Google Login */}
        <button onClick={handleGoogleLogin} className="btn btn-google">
          <svg className="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {activeTab === 'login' ? 'Đăng nhập bằng Google' : 'Đăng ký bằng Google'}
        </button>
      </div>
    </div>
  );
}