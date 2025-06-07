
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    loading,
    error,
    setError,
    isAuthenticated,
    setIsAuthenticated
  } = useAuthState();

  const {
    loading: operationsLoading,
    login,
    logout,
    updateProfile
  } = useAuthOperations(setUser, setIsAuthenticated, setError);

  const value: AuthContextType = {
    user,
    loading: loading || operationsLoading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User } from '@/types/auth';
