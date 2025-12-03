import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/2fa";

export const sendOTP = async (userId, email) => {
  const res = await axios.post(`${API_BASE_URL}/send-otp/${userId}`, { email });
  return res.data;
};

export const verifyOTP = async (userId, otp) => {
  const res = await axios.post(`${API_BASE_URL}/verify-otp/${userId}`, { otp });
  return res.data;
};

export const disable2FA = async (userId) => {
  const res = await axios.post(`${API_BASE_URL}/disable/${userId}`);
  return res.data;
};

export const check2FAStatus = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/status/${userId}`);
  return res.data;
};
