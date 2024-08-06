// src/api/users.js

import { axiosInstance } from "../api";


const getUsers = async () => {
  const response = await axiosInstance.get('/users/');
  return response.data;
};
export default getUsers;


export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users/', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/users/${id}/`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}/`);
  return response.data;
};
