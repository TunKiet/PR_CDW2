import axiosClient from "../api/axiosClient";

// ✅ Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  const res = await axiosClient.post("/orders", orderData);
  return res.data;
};

// ✅ Lấy danh sách đơn hàng (nếu cần)
export const getOrders = async () => {
  const res = await axiosClient.get("/orders");
  return res.data;
};

// ✅ Lấy chi tiết đơn hàng
export const getOrderById = async (orderId) => {
  const res = await axiosClient.get(`/orders/${orderId}`);
  return res.data;
};

// ✅ Cập nhật đơn hàng
export const updateOrder = async (orderId, data) => {
  const res = await axiosClient.put(`/orders/${orderId}`, data);
  return res.data;
};

// ✅ Xoá đơn hàng
export const deleteOrder = async (orderId) => {
  const res = await axiosClient.delete(`/orders/${orderId}`);
  return res.data;
};
