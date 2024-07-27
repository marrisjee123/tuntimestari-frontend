// src/api/auth.js

import { axiosInstance } from '../api';

export const login = async (username, password) => {
  const response = await axiosInstance.post('/login/', { username, password });
  return response.data;
};

export const getUserDetails = async () => {
  const response = await axiosInstance.get('/user/details/');
  return response.data;
};

export const completeRegistration = async (token, username, password) => {
  const response = await axiosInstance.post('/complete-registration/', {
    token,
    username,
    password,
  });
  return response.data;
};
