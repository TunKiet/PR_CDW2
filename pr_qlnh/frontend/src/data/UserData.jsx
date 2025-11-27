import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/users";

export const getAllUser = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};
export const getUserById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};
export const searchUser = async (phone) => {
  const res = await axios.get(`${API_BASE_URL}/search`, { params: { phone } });
  return res.data;
};
export const addUser = async (usersData) => {
  const res = await axios.post(API_BASE_URL, usersData);
  return res.data;
};

export const updateUser = async (id, usersData) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, usersData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/del/${id}`);
  return res.data;
};

export const getRoleByUserId = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/role-names/${userId}`);
  return res.data;
}
