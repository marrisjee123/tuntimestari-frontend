// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuloidaan käyttäjän latausta
    const fetchUser = async () => {
      // Tässä voisi olla API-kutsu tai muu autentikointilogiikka
      const userData = {
        username: 'testuser',
        is_superuser: false,
        is_org_admin: true,
        is_group_admin: false,
      };
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const signIn = (newUser) => {
    setUser(newUser);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
