import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { axiosInstance } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        if (!accessToken && !user) {
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get('/user-details/');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    if (!user) verifyUser();
  }, []);

  const signIn = async (username, password) => {
    try {
      const response = await axiosInstance.post('/token/', { username, password });

      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      Cookies.set('access_token', response.data.access, { secure: true, sameSite: 'Strict' });
      Cookies.set('refresh_token', response.data.refresh, { secure: true, sameSite: 'Strict' });

      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
