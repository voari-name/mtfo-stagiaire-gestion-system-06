
import { useState } from 'react';
import { useSupabaseAuthContext } from '@/contexts/SupabaseAuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const { updateUserPassword, loading, logout } = useSupabaseAuthContext();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }
    const success = await updateUserPassword(password);
    if (success) {
      toast({
        title: "Mot de passe mis à jour",
        description: "Veuillez vous connecter avec votre nouveau mot de passe."
      });
      await logout('/auth');
    } else {
      setError("Une erreur est survenue lors de la mise à jour. Veuillez réessayer.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mettre à jour le mot de passe</CardTitle>
          <CardDescription className="text-center">Choisissez un nouveau mot de passe.</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdatePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Entrez votre nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UpdatePassword;
