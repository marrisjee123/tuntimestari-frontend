import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthChecker = ({ children }) => {
  const { checkAndRefreshToken, setUser } = useAuth();

  const handleActivity = async () => {
    await checkAndRefreshToken();
    const userData = await getMe();
    setUser(userData);
  };

  useEffect(() => {
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, []);

  return <>{children}</>;
};

export default AuthChecker;
