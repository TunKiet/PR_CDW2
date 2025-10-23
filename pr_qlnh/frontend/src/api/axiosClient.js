// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api", // ⚙️ Backend Laravel
  headers: {
    "Content-Type": "application/json",
  },
});

// (Tuỳ chọn) xử lý lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosClient;
