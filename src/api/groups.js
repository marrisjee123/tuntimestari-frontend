// src/api/groups.js

import api from '../api';

export const getGroups = async () => {
  const response = await api.get('/api/groups/');
  return response.data;
};

export const getGroup = async (id) => {
  const response = await api.get(`/api/groups/${id}/`);
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await api.post('/api/groups/', groupData);
  return response.data;
};

export const updateGroup = async (id, groupData) => {
  const response = await api.put(`/api/groups/${id}/`, groupData);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await api.delete(`/api/groups/${id}/`);
  return response.data;
};
