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
      console.log("⚠️ Hết phiên đăng nhập — chuyển sang login");
      // redirect login nếu cần
      // window.location.href = "/login";
    }

    throw error;
  }
);

export default axiosClient;
