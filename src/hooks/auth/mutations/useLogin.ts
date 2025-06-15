
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UseLoginProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLogin = ({ setLoading, setError }: UseLoginProps) => {
  const { toast } = useToast();

  const login = async (loginIdentifier: string, password: string): Promise<boolean> => {
    let email = loginIdentifier;
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentative de connexion avec:", loginIdentifier);
      
      if (!loginIdentifier.includes('@') && loginIdentifier) {
        console.log("Ce n'est pas un email, on suppose que c'est un nom d'utilisateur. Appel RPC...");
        const { data: rpcEmail, error: rpcError } = await supabase.rpc('get_email_for_username', {
          p_username: loginIdentifier
        });

        if (rpcError) {
          console.error("Erreur RPC get_email_for_username:", rpcError);
          throw new Error("Erreur lors de la vérification du nom d'utilisateur.");
        }

        if (!rpcEmail) {
          console.log("Nom d'utilisateur non trouvé:", loginIdentifier);
          throw new Error("Invalid login credentials");
        }
        
        email = rpcEmail;
        console.log(`Email récupéré pour ${loginIdentifier}: ${email}`);
      }
      
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
        return true;
      }

      return false;
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      
      let errorMessage = 'Erreur lors de la connexion';
      
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = `Mila manamarina ny mailakao aloha ianao vao afaka miditra. (${email}) Jereo ny boaty fandraisanao mailaka (inbox).`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage.split('(')[0].trim(),
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  return login;
};

