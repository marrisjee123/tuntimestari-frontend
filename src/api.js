// src/api.js

import axios from 'axios';
import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const { data } = await axiosInstance.post('/token/refresh/', {
            refresh: refreshToken
          });
          Cookies.set('access_token', data.access, { secure: true, sameSite: 'strict' });
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await axiosInstance.post('/login/', {
    username,
    password
  });
  Cookies.set('access_token', response.data.token, { secure: true, sameSite: 'strict' });
  Cookies.set('refresh_token', response.data.refresh, { secure: true, sameSite: 'strict' });
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get('/users/');
  return response.data;
};
