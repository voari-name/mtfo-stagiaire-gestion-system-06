
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UseSignupProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSignup = ({ setLoading, setError }: UseSignupProps) => {
  const { toast } = useToast();

  const signup = async (email: string, password: string, userData?: any): Promise<boolean> => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };
  return signup;
};
