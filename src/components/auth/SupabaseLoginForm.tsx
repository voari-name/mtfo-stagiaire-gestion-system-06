
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSupabaseAuthContext } from "@/contexts/SupabaseAuthContext";

const SupabaseLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useSupabaseAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Card className="w-full max-w-md mx-4 shadow-2xl border-t-4 border-t-blue-800 animate-scale-in">
      <CardHeader className="space-y-1 flex items-center flex-col">
        <div className="flex justify-center mb-4 animate-fade-in">
          <img src="/lovable-uploads/bbbcd3ef-0021-42ca-8d32-8796bd1cf670.png" alt="MTFoP Logo" className="h-16 w-auto hover-scale transition-transform duration-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-center animate-fade-in">Authentification</CardTitle>
        <CardDescription className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
          Connectez-vous pour accéder à la plateforme
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required className="transition-all duration-300 focus:scale-105" disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="transition-all duration-300 focus:scale-105" disabled={loading} />
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm animate-fade-in">
              <p>{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900 hover-scale transition-all duration-300" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SupabaseLoginForm;
