import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Paper, Avatar, Box, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { axiosInstance } from '../api';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/token/', { username, password });

      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      Cookies.set('access_token', response.data.access, { secure: true, sameSite: 'Strict' });
      Cookies.set('refresh_token', response.data.refresh, { secure: true, sameSite: 'Strict' });

      setError('');
      navigate('/');
    } catch (error) {
      if (error.response) {
        console.error('Login error response:', error.response);
        setError('Login failed. Please check your credentials.');
      } else if (error.request) {
        console.error('Login error request:', error.request);
        setError('No response from server. Please try again later.');
      } else {
        console.error('Login error message:', error.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Button href="#" variant="body2">
                  Forgot password?
                </Button>
              </Grid>
              <Grid item>
                <Button href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
