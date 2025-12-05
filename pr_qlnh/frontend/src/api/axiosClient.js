import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // ✅ Dùng 127.0.0.1 tránh lỗi cookie/CORS
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ cần khi login Sanctum/Passport sau này
});

// ✅ Interceptor xử lý lỗi và Token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // nếu login rồi thì gửi token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor bắt lỗi
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🚨 API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";
      
      // Kiểm tra nếu token expired
      if (errorMessage.includes("expired") || errorMessage.includes("Token has expired")) {
        console.log("⚠️ Token đã hết hạn — đăng xuất và chuyển sang login");
        
        // Xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Hiển thị thông báo
        alert("⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        
        // Redirect về login (route "/" là LoginPage)
        window.location.href = "/";
      } else {
        console.log("⚠️ Không có quyền truy cập");
      }
    }

    throw error;
  }
);

export default axiosClient;
