// src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRole = user.is_superuser ? 'superuser' :
                   user.is_org_admin ? 'org_admin' :
                   user.is_group_admin ? 'group_admin' : 'user';

  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
