
import { useCallback } from 'react';
import { useSupabaseAuthState } from './useSupabaseAuthState';
import { useSupabaseAuthMutations } from './useSupabaseAuthMutations';

export const useSupabaseAuth = () => {
  const { user, session, loading: authStateLoading } = useSupabaseAuthState();
  const { 
    login, 
    signup, 
    logout, 
    updateProfile: updateProfileMutation,
    resendConfirmationEmail,
    loading: operationsLoading,
    error,
    setError
  } = useSupabaseAuthMutations();

  const updateProfile = useCallback(async (userData: any): Promise<boolean> => {
    if (!user) {
      const errorMessage = 'Utilisateur non authentifié pour la mise à jour du profil';
      setError(errorMessage);
      return false;
    }
    return updateProfileMutation(user, userData);
  }, [user, updateProfileMutation, setError]);

  return {
    user,
    session,
    loading: authStateLoading || operationsLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    resendConfirmationEmail
  };
};
