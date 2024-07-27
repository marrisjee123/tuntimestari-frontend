// src/api/holidays.js

import { axiosInstance } from '../api';

export const getHolidays = async () => {
  const response = await axiosInstance.get('/holidays/');
  return response.data;
};
