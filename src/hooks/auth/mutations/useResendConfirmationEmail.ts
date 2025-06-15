
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UseResendConfirmationEmailProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResendConfirmationEmail = ({ setLoading, setError }: UseResendConfirmationEmailProps) => {
  const { toast } = useToast();

  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };
  return resendConfirmationEmail;
};
