// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme'; // Tuo mukautettu teema
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
import SetHours from './components/SetHours';
import UserCreationPage from './pages/UserCreationPage';
import CreateOrganization from './pages/CreateOrganization';
import CreateGroup from './pages/CreateGroup';
import CalendarHomePage from './pages/CalendarHomePage';

const links = [
  { name: 'Users', path: '/users' },
  { name: 'Organizations', path: '/organizations' },
  { name: 'Groups', path: '/groups' },
  { name: 'Admin Dashboard', path: '/admin' },
  { name: 'Org Admin Dashboard', path: '/org-admin' },
  { name: 'Group Admin Dashboard', path: '/group-admin' },
  { name: 'User Dashboard', path: '/user' },
  { name: 'Rule Form', path: '/ruleform' },
  { name: 'Työvuorot', path: '/tyovuorot' },
];

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
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
                <Route path="/tyovuorot" element={<SetHours />} />
                <Route path="/" element={<CalendarHomePage />} />
                <Route path="/lisaa-tyontekija" element={<UserCreationPage />} />
                <Route path="/vuorosuunnittelu" element={<SetHours />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['superuser', 'org_admin', 'group_admin', 'user']} />}>
                <Route path="/users" element={<Users />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/ruleform" element={<RuleForm />} />
                <Route path="/lisaa-ryhma" element={<CreateGroup />} />
                <Route path="/lisaa-organisaatio" element={<CreateOrganization />} />
              </Route>

              <Route path="/" element={<SignIn />} /> {/* Redirect to SignIn or a Dashboard */}
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
