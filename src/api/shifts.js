// src/api/shifts.js

import { axiosInstance } from '../api';

export const getShifts = async () => {
  const response = await axiosInstance.get('/shifts/');
  return response.data;
};

export const createShift = async (shiftData) => {
  const response = await axiosInstance.post('/shifts/', shiftData);
  return response.data;
};

export const updateShift = async (id, shiftData) => {
  const response = await axiosInstance.put(`/shifts/${id}/`, shiftData);
  return response.data;
};

export const deleteShift = async (id) => {
  const response = await axiosInstance.delete(`/shifts/${id}/`);
  return response.data;
};
