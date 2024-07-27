// src/api/organizations.js

import { axiosInstance } from '../api';

export const getOrganizationsGroupsUsers = async () => {
  const response = await axiosInstance.get('/organizations_groups_users/');
  return response.data;
};

export const getOrganizations = async () => {
  const response = await axiosInstance.get('/organizations/');
  return response.data;
};

export const getOrganization = async (id) => {
  const response = await axiosInstance.get(`/organizations/${id}/`);
  return response.data;
};

export const createOrganization = async (orgData) => {
  const response = await axiosInstance.post('/organizations/', orgData);
  return response.data;
};

export const updateOrganization = async (id, orgData) => {
  const response = await axiosInstance.put(`/organizations/${id}/`, orgData);
  return response.data;
};

export const deleteOrganization = async (id) => {
  const response = await axiosInstance.delete(`/organizations/${id}/`);
  return response.data;
};

export const getGroupsByOrganization = async (organizationId) => {
  const response = await axiosInstance.get(`/organizations/${organizationId}/groups/`);
  return response.data;
};

export const getGroup = async (id) => {
  const response = await axiosInstance.get(`/groups/${id}/`);
  return response.data;
};

export const createGroup = async (organizationId, groupData) => {
  const response = await axiosInstance.post(`/organizations/${organizationId}/groups/`, { name: groupData.name });
  return response.data;
};

export const updateGroup = async (id, groupData) => {
  const response = await axiosInstance.put(`/groups/${id}/`, groupData);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await axiosInstance.delete(`/groups/${id}/`);
  return response.data;
};

export const getUsersByGroup = async (groupId) => {
  const response = await axiosInstance.get(`/groups/${groupId}/users/`);
  return response.data;
};

export const addUserToGroup = async (groupId, userData) => {
  const response = await axiosInstance.post(`/groups/${groupId}/users/`, userData);
  return response.data;
};

export const removeUserFromGroup = async (groupId, userId) => {
  const response = await axiosInstance.delete(`/groups/${groupId}/users/${userId}/`);
  return response.data;
};
