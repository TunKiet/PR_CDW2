import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/permissions";

export const getAllPermission = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const getPermissionById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const addPermission = async (permissionData) => {
  const res = await axios.post(API_BASE_URL, permissionData);
  return res.data;
};

export const updatePermission = async (id, permissionData) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, permissionData);
  return res.data;
};

export const deletePermission = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const getRolesByPermission = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}/roles`);
  return res.data;
};
