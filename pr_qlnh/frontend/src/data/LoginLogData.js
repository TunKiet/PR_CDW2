// src/data/LoginLogData.js
import axios from "axios";

const API_URL = "http://localhost:8000/api";

/**
 * Lấy danh sách login logs của user hiện tại
 */
export const getUserLoginLogs = async (limit = 50) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/login-logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching login logs:", error);
    throw error;
  }
};

/**
 * Lấy danh sách login logs của một user cụ thể (dành cho admin)
 */
export const getLoginLogsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/login-logs/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user login logs:", error);
    throw error;
  }
};
