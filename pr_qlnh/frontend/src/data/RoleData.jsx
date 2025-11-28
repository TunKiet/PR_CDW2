import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/roles";

export const getAllRole = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};
export const getRoleById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};
export const addRole = async (RolesData) => {
  const res = await axios.post(API_BASE_URL, RolesData);
  return res.data;
};

export const updateRole = async (id, RolesData) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, RolesData);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const assignPermissions = async (id, permissions) => {
  const res = await axios.post(`${API_BASE_URL}/${id}/permissions`, { permissions });
  return res.data;
};

export const getUsersByRole = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}/users`);
  return res.data;
};
