import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

export const useSupabaseAuthMutations = () => {
  const [operationsLoading, setOperationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setOperationsLoading(true);
      setError(null);
      
      console.log("Tentative de connexion avec Supabase:", email);
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur la plateforme de gestion",
        });
        navigate('/dashboard');
        return true;
      }

      return false;
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      
      let errorMessage = 'Erreur lors de la connexion';
      
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Mila manamarina ny mailakao aloha ianao vao afaka miditra. Jereo ny boaty fandraisanao mailaka (inbox).';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setOperationsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: any): Promise<boolean> => {
    try {
      setOperationsLoading(true);
      setError(null);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
        return true;
      }

      return false;
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (err.message?.includes('User already registered')) {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setOperationsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setOperationsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('Erreur lors de la déconnexion:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    } finally {
      setOperationsLoading(false);
    }
  };

  const updateProfile = async (user: User, userData: any): Promise<boolean> => {
    try {
      setOperationsLoading(true);
      setError(null);
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      const errorMessage = err.message || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setOperationsLoading(false);
    }
  };

  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    try {
      setOperationsLoading(true);
      setError(null);

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (resendError) {
        throw resendError;
      }

      toast({
        title: "Mail de confirmation renvoyé",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
      return true;
    } catch (err: any)
    {
      console.error("Erreur lors du renvoi de l'email de confirmation:", err);
      const errorMessage = err.message || "Erreur lors du renvoi de l'email";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setOperationsLoading(false);
    }
  };


  return {
    login,
    signup,
    logout,
    updateProfile,
    resendConfirmationEmail,
    loading: operationsLoading,
    error,
    setError,
  };
};
