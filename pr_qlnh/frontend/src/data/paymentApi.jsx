import axiosClient from "../api/axiosClient";

// ✅ Tạo thanh toán mới
export const createPayment = async (paymentData) => {
  const res = await axiosClient.post("/payments", paymentData);
  return res.data;
};

// ✅ Lấy danh sách thanh toán
export const getPayments = async () => {
  const res = await axiosClient.get("/payments");
  return res.data;
};

// ✅ Lấy chi tiết thanh toán
export const getPaymentById = async (paymentId) => {
  const res = await axiosClient.get(`/payments/${paymentId}`);
  return res.data;
};
