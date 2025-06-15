
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UseUpdateUserPasswordProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUpdateUserPassword = ({ setLoading, setError }: UseUpdateUserPasswordProps) => {
  const { toast } = useToast();

  const updateUserPassword = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser({ password: password });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du mot de passe:', err);
      const errorMessage = err.message || 'Erreur lors de la mise à jour du mot de passe';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  return updateUserPassword;
};
