import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Grid, Paper, MenuItem } from '@mui/material';
import { fetchOrganizationUsers, createGroup } from '../api';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    adminId: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchOrganizationUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    getUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createGroup(formData.groupName, formData.adminId);
      alert('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group.');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create New Group
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Group Name"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Select Admin"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Group
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateGroup;
