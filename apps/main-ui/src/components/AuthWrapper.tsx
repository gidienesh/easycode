import React from 'react';
import { useUser } from '../providers/UserProvider';
import { LoadingOverlay, Center, Loader } from '@mantine/core';
import LoginPage from '../pages/LoginPage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading, login, isAuthenticated } = useUser();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage onLogin={login} />;
  }

  return <>{children}</>;
}

export default AuthWrapper;