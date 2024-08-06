import { axiosInstance } from '../api';

export const login = async (username, password) => {
  const response = await axiosInstance.post('/login/', { username, password });
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/token/refresh/', { refresh: refreshToken });
  return response.data;
};

export const getUserDetails = async () => {
  const response = await axiosInstance.get('/api/user/details/');
  return response.data;
};

export const completeRegistration = async (token, username, password) => {
  const response = await axiosInstance.post('/api/register/', {
    token,
    username,
    password,
  });
  return response.data;
};
