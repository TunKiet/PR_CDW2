import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/customers";

export const getCustomers = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const searchCustomers = async (query) => {
  const res = await axios.get(`${API_BASE_URL}/search`, { params: { q: query } });
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
export const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const getRankColor = (rank) => {
  switch (rank) {
    case 'Kim Cương':
      return 'bg-blue-500 text-white';
    case 'Vàng':
      return 'bg-yellow-400 text-gray-800';
    case 'Bạc':
      return 'bg-gray-300 text-gray-800';
    case 'Đồng':
    default:
      return 'bg-orange-300 text-gray-800';
  }
};
