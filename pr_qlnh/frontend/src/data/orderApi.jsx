import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/orders`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
    throw error;
  }
};
