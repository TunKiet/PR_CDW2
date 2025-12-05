import axiosClient from "../api/axiosClient";

export const getAllRole = async () => {
  const res = await axiosClient.get("/roles");
  return res.data;
};

export const getRoleById = async (id) => {
  const res = await axiosClient.get(`/roles/${id}`);
  return res.data;
};

export const addRole = async (RolesData) => {
  const res = await axiosClient.post("/roles", RolesData);
  return res.data;
};

export const updateRole = async (id, RolesData) => {
  const res = await axiosClient.put(`/roles/${id}`, RolesData);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await axiosClient.delete(`/roles/${id}`);
  return res.data;
};

export const assignPermissions = async (id, permissions) => {
  const res = await axiosClient.post(`/roles/${id}/permissions`, { permissions });
  return res.data;
};

export const getUsersByRole = async (id) => {
  const res = await axiosClient.get(`/roles/${id}/users`);
  return res.data;
};
