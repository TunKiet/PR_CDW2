import axiosClient from "../api/axiosClient";

export const getAllPermission = async () => {
  const res = await axiosClient.get("/permissions");
  return res.data;
};

export const getPermissionById = async (id) => {
  const res = await axiosClient.get(`/permissions/${id}`);
  return res.data;
};

export const addPermission = async (permissionData) => {
  const res = await axiosClient.post("/permissions", permissionData);
  return res.data;
};

export const updatePermission = async (id, permissionData) => {
  const res = await axiosClient.put(`/permissions/${id}`, permissionData);
  return res.data;
};

export const deletePermission = async (id) => {
  const res = await axiosClient.delete(`/permissions/${id}`);
  return res.data;
};

export const getRolesByPermission = async (id) => {
  const res = await axiosClient.get(`/permissions/${id}/roles`);
  return res.data;
};
