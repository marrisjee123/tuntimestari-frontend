import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { axiosInstance } from '../api';

const CreateOrganization = () => {
    const [orgName, setOrgName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/create-organization/', {
                organization: { name: orgName },
                admin: { email: adminEmail, password: adminPassword }
            });
            setMessage('Organization and admin created successfully');
        } catch (error) {
            setMessage('Error creating organization and admin');
        }
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Organization
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Organization Name"
                                variant="outlined"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Admin Email"
                                type="email"
                                variant="outlined"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Admin Password"
                                type="password"
                                variant="outlined"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {message && (
                    <Box mt={2}>
                        <Typography variant="body1" color="error">
                            {message}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default CreateOrganization;
