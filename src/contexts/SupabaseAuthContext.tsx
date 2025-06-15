
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import type { User, Session } from '@supabase/supabase-js';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  isAuthenticated: boolean;
  login: (loginIdentifier: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData?: any) => Promise<boolean>;
  logout: (redirectTo?: string) => Promise<void>;
  updateProfile: (userData: any) => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  resetPasswordForEmail: (email: string) => Promise<boolean>;
  updateUserPassword: (password: string) => Promise<boolean>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth();

  return (
    <SupabaseAuthContext.Provider value={auth}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuthContext = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuthContext must be used within a SupabaseAuthProvider');
  }
  return context;
};
