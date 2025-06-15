
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UseResetPasswordForEmailProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResetPasswordForEmail = ({ setLoading, setError }: UseResetPasswordForEmailProps) => {
  const { toast } = useToast();

  const resetPasswordForEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Mail de réinitialisation envoyé",
        description: "Vérifiez votre email pour réinitialiser votre mot de passe.",
      });
      return true;
    } catch (err: any) {
      console.error("Erreur lors de l'envoi du mail de réinitialisation:", err);
      const errorMessage = err.message || "Erreur lors de l'envoi de l'email";
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
  return resetPasswordForEmail;
};
