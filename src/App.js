// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Users from './components/Users';
import Organizations from './components/Organizations';
import CompleteRegistration from './components/CompleteRegistration';
import AdminDashboard from './components/AdminDashboard';
import OrgAdminDashboard from './components/OrgAdminDashboard';
import GroupAdminDashboard from './components/GroupAdminDashboard';
import UserDashboard from './components/UserDashboard';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import RuleForm from './components/RuleForm';
import { getGroupsByOrganization, getGroup } from './api/organizations';  // Tuo funktiot

const links = [
  { name: 'Users', path: '/users' },
  { name: 'Organizations', path: '/organizations' },
  { name: 'Groups', path: '/groups' },
  { name: 'Admin Dashboard', path: '/admin' },
  { name: 'Org Admin Dashboard', path: '/org-admin' },
  { name: 'Group Admin Dashboard', path: '/group-admin' },
  { name: 'User Dashboard', path: '/user' },
  { name: 'Rule Form', path: '/ruleform' },
];

const App = () => {
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroupsByOrganization = async (organizationId) => {
      try {
        const data = await getGroupsByOrganization(organizationId);
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    const fetchGroup = async (groupId) => {
      try {
        const data = await getGroup(groupId);
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

    // Kutsu funktioita tarvittaessa
    // fetchGroupsByOrganization(1); // Esimerkki kutsusta
    // fetchGroup(1); // Esimerkki kutsusta
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <Header links={links} />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />
            
            <Route element={<ProtectedRoute allowedRoles={['superuser']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['org_admin']} />}>
              <Route path="/org-admin" element={<OrgAdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['group_admin']} />}>
              <Route path="/group-admin" element={<GroupAdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['superuser', 'org_admin', 'group_admin', 'user']} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/ruleform" element={<RuleForm />} />
            </Route>

            <Route path="/" element={<SignIn />} /> {/* Redirect to SignIn or a Dashboard */}
            <Route path="/ruleform" element={<RuleForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
