import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/customers";

export const getCustomers = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const searchCustomers = async (phone) => {
  const res = await axios.get(`${API_BASE_URL}/search`, { params: { phone } });
  return res.data;
};



export const addCustomer = async (customerData) => {
  const res = await axios.post(API_BASE_URL, customerData);
  return res.data;
};

export const updateCustomer = async (id, customerData) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, customerData);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};
// src/data/customerData.js
export const formatCurrency = (value) => {
  const number = Math.floor(Number(value) || 0);
  return number.toLocaleString("vi-VN") + "đ";
};

// 🎖️ Tính hạng theo điểm
export const getRankByPoints = (points = 0) => {
  if (points >= 50000) return "Kim Cương";
  if (points >= 15000) return "Vàng";
  if (points >= 5000) return "Bạc";
  return "Đồng";
};


// 🎨 Màu sắc theo hạng
export const getRankColor = (rankOrPoints) => {
  let rank = rankOrPoints;

  // Nếu truyền vào là điểm (số) → tự tính rank
  if (typeof rankOrPoints === "number") {
    rank = getRankByPoints(rankOrPoints);
  }

  switch (rank) {
    case "Kim Cương":
      return "bg-cyan-100 text-cyan-700 border border-cyan-300";
    case "Vàng":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "Bạc":
      return "bg-gray-100 text-gray-700 border border-gray-300";
    default:
      return "bg-amber-100 text-amber-700 border border-amber-300"; // Đồng
  }
};
