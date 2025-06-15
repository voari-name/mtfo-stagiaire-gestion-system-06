
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type UseLoginProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLogin = ({ setLoading, setError }: UseLoginProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentative de connexion avec l'email:", email);
      
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
      
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('Email not confirmed')) {
        errorMessage = 'Email ou mot de passe incorrect';
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
      setLoading(false);
    }
  };
  return login;
};
