// src/components/Organizations.jsx

import React, { useEffect, useState } from 'react';
import {
  getOrganizationsGroupsUsers,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  createGroup,
  updateGroup,
  deleteGroup,
  addUserToGroup,
  removeUserFromGroup
} from '../api/organizations';
import { useNavigate } from 'react-router-dom';

const Organizations = () => {
  const [data, setData] = useState([]);
  const [newOrganizationName, setNewOrganizationName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOrganizationsGroupsUsers();
        setData(result);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/signin'); // Ohjaa kirjautumissivulle, jos ei ole käyttöoikeutta
        } else {
          console.error('Failed to fetch data:', error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreateOrganization = async () => {
    try {
      const created = await createOrganization({ name: newOrganizationName });
      setData([...data, { organization: created, groups: [] }]);
      setNewOrganizationName('');
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleCreateGroup = async (organizationId) => {
    try {
      const created = await createGroup(organizationId, { name: newGroupName });
      const updatedData = data.map(orgData =>
        orgData.organization.id === organizationId
          ? { ...orgData, groups: [...orgData.groups, { group: created, users: [] }] }
          : orgData
      );
      setData(updatedData);
      setNewGroupName('');
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleDeleteOrganization = async (organizationId) => {
    try {
      await deleteOrganization(organizationId);
      setData(data.filter(orgData => orgData.organization.id !== organizationId));
    } catch (error) {
      console.error('Failed to delete organization:', error);
    }
  };

  const handleDeleteGroup = async (organizationId, groupId) => {
    try {
      await deleteGroup(groupId);
      const updatedData = data.map(orgData =>
        orgData.organization.id === organizationId
          ? { ...orgData, groups: orgData.groups.filter(g => g.group.id !== groupId) }
          : orgData
      );
      setData(updatedData);
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleAddUserToGroup = async (groupId) => {
    try {
      const newUser = await addUserToGroup(groupId, { username: newUserName });
      const updatedData = data.map(orgData =>
        orgData.organization.id === selectedOrganization.id
          ? {
              ...orgData,
              groups: orgData.groups.map(groupData =>
                groupData.group.id === groupId
                  ? { ...groupData, users: [...groupData.users, newUser] }
                  : groupData
              )
            }
          : orgData
      );
      setData(updatedData);
      setNewUserName('');
    } catch (error) {
      console.error('Failed to add user to group:', error);
    }
  };

  const handleRemoveUserFromGroup = async (groupId, userId) => {
    try {
      await removeUserFromGroup(groupId, userId);
      const updatedData = data.map(orgData =>
        orgData.organization.id === selectedOrganization.id
          ? {
              ...orgData,
              groups: orgData.groups.map(groupData =>
                groupData.group.id === groupId
                  ? { ...groupData, users: groupData.users.filter(user => user.id !== userId) }
                  : groupData
              )
            }
          : orgData
      );
      setData(updatedData);
    } catch (error) {
      console.error('Failed to remove user from group:', error);
    }
  };

  return (
    <div>
      <h2>Organizations, Groups, and Users</h2>
      <div>
        <input
          type="text"
          value={newOrganizationName}
          onChange={(e) => setNewOrganizationName(e.target.value)}
          placeholder="New organization name"
        />
        <button onClick={handleCreateOrganization}>Create Organization</button>
      </div>
      {data.map((orgData, index) => (
        <div key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <h3>Organization: {orgData.organization.name}</h3>
          <button onClick={() => handleDeleteOrganization(orgData.organization.id)}>Delete Organization</button>
          <div>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New group name"
            />
            <button onClick={() => handleCreateGroup(orgData.organization.id)}>Create Group</button>
          </div>
          {orgData.groups.map((groupData, gIndex) => (
            <div key={gIndex} style={{ marginLeft: '20px', marginBottom: '10px' }}>
              <h4>Group: {groupData.group.name}</h4>
              <button onClick={() => handleDeleteGroup(orgData.organization.id, groupData.group.id)}>Delete Group</button>
              <ul>
                {groupData.users.map(user => (
                  <li key={user.id}>
                    {user.username} - {user.email}
                    <button onClick={() => handleRemoveUserFromGroup(groupData.group.id, user.id)}>Remove User</button>
                  </li>
                ))}
              </ul>
              <div>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="New user name"
                />
                <button onClick={() => {
                  setSelectedOrganization(orgData.organization);
                  handleAddUserToGroup(groupData.group.id);
                }}>Add User</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Organizations;


