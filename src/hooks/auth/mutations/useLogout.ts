
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type UseLogoutProps = {
  setLoading: (loading: boolean) => void;
}

export const useLogout = ({ setLoading }: UseLogoutProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const logout = async (redirectTo = '/'): Promise<void> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      
      navigate(redirectTo);
    } catch (err: any) {
      console.error('Erreur lors de la déconnexion:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return logout;
};
