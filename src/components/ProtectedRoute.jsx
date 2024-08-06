import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
