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


// 🧮 Hàm xác định hạng thành viên dựa trên điểm
export const getRankName = (points) => {
  if (points >= 15000) return "Kim Cương";
  if (points >= 5000) return "Vàng";
  if (points >= 1500) return "Bạc";
  return "Đồng";
};


// 🎨 Màu hiển thị tương ứng với hạng
export const getRankColor = (rank) => {
  switch (rank) {
    case "Kim Cương":
      return "bg-gradient-to-r from-cyan-400 to-blue-600 text-white";
    case "Vàng":
      return "bg-yellow-400 text-white";
    case "Bạc":
      return "bg-gray-300 text-gray-800";
    default:
      return "bg-orange-300 text-white";
  }
};
// 🔧 Thêm hàm getRankByPoints để tránh lỗi import
export const getRankByPoints = (points) => {
  return getRankName(points);
};