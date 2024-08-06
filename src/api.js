import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.common['X-CSRFTOKEN'] = csrftoken;

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
          Cookies.set('access_token', data.access, { secure: true, sameSite: 'Strict' });
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const fetchGroups = async () => {
  const response = await axiosInstance.get('/groups/');
  return response.data;
};

export const createUser = async (username, password, groupId) => {
  const response = await axiosInstance.post('/users/', {
    username,
    password,
    group: groupId
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get('/users/');
  return response.data;
};

export const fetchOrganizationUsers = async () => {
  const response = await axiosInstance.get('/organization-users/');
  return response.data;
};

export const createGroup = async (name, admin_id) => {
  const response = await axiosInstance.post('/groups/create_group/', {
    name,
    admin_id
  });
  return response.data;
};

export const createAnnouncement = async (title, content, group_id = null) => {
  const response = await axiosInstance.post('/announcements/', {
    title,
    content,
    group: group_id
  });
  return response.data;
};

export const fetchAnnouncements = async () => {
  const response = await axiosInstance.get('/announcements/');
  return response.data;
};
