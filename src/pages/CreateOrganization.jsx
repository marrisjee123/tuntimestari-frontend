import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { axiosInstance } from '../api';

const CreateOrganizationPage = () => {
    const [formData, setFormData] = useState({
        orgName: '',
        registrationNumber: '',
        address: '',
        phoneNumber: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/create-organization/', {
                organization: {
                    name: formData.orgName,
                    registration_number: formData.registrationNumber,
                    address: formData.address,
                    phone_number: formData.phoneNumber
                },
                admin: {
                    username: formData.username,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password
                }
            });
            if (response.status === 201) {
                alert('Organisaatio ja admin luotu onnistuneesti!');
            } else {
                throw new Error(response.data.detail || 'Virhe luotaessa organisaatiota ja adminia.');
            }
        } catch (error) {
            console.error('Virhe:', error);
            alert(error.message);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={6} sx={{ p: 4 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Luo Organisaatio ja Pääkäyttäjä
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6">Organisaation Tiedot</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Organisaation Nimi"
                                name="orgName"
                                value={formData.orgName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Y-tunnus"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Osoite"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Puhelinnumero"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                        Pääkäyttäjän Tiedot
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Etunimi"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Sukunimi"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Käyttäjätunnus"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Sähköposti"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Salasana"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Luo
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateOrganizationPage;

