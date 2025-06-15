
import { useState } from 'react';
import { useLogin } from './mutations/useLogin';
import { useSignup } from './mutations/useSignup';
import { useLogout } from './mutations/useLogout';
import { useUpdateProfile } from './mutations/useUpdateProfile';
import { useResendConfirmationEmail } from './mutations/useResendConfirmationEmail';
import { useResetPasswordForEmail } from './mutations/useResetPasswordForEmail';
import { useUpdateUserPassword } from './mutations/useUpdateUserPassword';

export const useSupabaseAuthMutations = () => {
  const [operationsLoading, setOperationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useLogin({ setLoading: setOperationsLoading, setError });
  const signup = useSignup({ setLoading: setOperationsLoading, setError });
  const logout = useLogout({ setLoading: setOperationsLoading });
  const updateProfile = useUpdateProfile({ setLoading: setOperationsLoading, setError });
  const resendConfirmationEmail = useResendConfirmationEmail({ setLoading: setOperationsLoading, setError });
  const resetPasswordForEmail = useResetPasswordForEmail({ setLoading: setOperationsLoading, setError });
  const updateUserPassword = useUpdateUserPassword({ setLoading: setOperationsLoading, setError });

  return {
    login,
    signup,
    logout,
    updateProfile,
    resendConfirmationEmail,
    resetPasswordForEmail,
    updateUserPassword,
    loading: operationsLoading,
    error,
    setError,
  };
};
