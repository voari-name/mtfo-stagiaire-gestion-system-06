
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

type UseUpdateProfileProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUpdateProfile = ({ setLoading, setError }: UseUpdateProfileProps) => {
  const { toast } = useToast();

  const updateProfile = async (user: User, userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
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
      setLoading(false);
    }
  };
  return updateProfile;
};
