
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSupabaseAuthContext } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";

const SupabaseLoginForm = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const { login, signup, loading, error, resendConfirmationEmail, resetPasswordForEmail } = useSupabaseAuthContext();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password, {
      username,
      first_name: firstName,
      last_name: lastName
    });
  };
  
  const handleResendConfirmation = async () => {
    if (email) {
      await resendConfirmationEmail(email);
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        toast({ title: "Erreur", description: "Veuillez entrer votre email.", variant: "destructive" });
        return;
    }
    const success = await resetPasswordForEmail(email);
    if (success) {
        toast({ title: "Email envoyé", description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe." });
        setView('login');
    }
  };
  
  const renderLogin = () => (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4 animate-fade-in">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required className="transition-all duration-300 focus:scale-105" disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="transition-all duration-300 focus:scale-105" disabled={loading} />
          <div className="text-right text-sm">
            <Button type="button" variant="link" className="p-0 h-auto font-normal" onClick={() => setView('forgot_password')}>Mot de passe oublié ?</Button>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm animate-fade-in">
            <p>{error}</p>
            {error.includes("manamarina ny mailakao") && (
              <Button variant="link" type="button" onClick={handleResendConfirmation} disabled={loading} className="p-0 h-auto mt-2 text-red-700 font-bold hover:underline">
                {loading ? "Mandefa..." : "Alefaso indray ny mailaka fanamarinana"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900 hover-scale transition-all duration-300" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </CardFooter>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={loading} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input id="username" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupEmail">Email</Label>
          <Input id="signupEmail" type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupPassword">Mot de passe</Label>
          <Input id="signupPassword" type="password" placeholder="Choisissez un mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm animate-fade-in">{error}</div>
        )}
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 hover-scale transition-all duration-300" disabled={loading}>
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </CardFooter>
    </form>
  );
  
  const renderForgotPassword = () => (
      <form onSubmit={handlePasswordResetRequest}>
        <CardContent className="space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground">Entrez votre addresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input id="reset-email" type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required className="transition-all duration-300 focus:scale-105" disabled={loading} />
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm animate-fade-in">{error}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900 hover-scale transition-all duration-300" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </Button>
        </CardFooter>
      </form>
  );

  return (
    <Card className="w-full max-w-md mx-4 shadow-2xl border-t-4 border-t-blue-800 animate-scale-in">
      <CardHeader className="space-y-1 flex items-center flex-col">
        <div className="flex justify-center mb-4 animate-fade-in">
          <img src="/lovable-uploads/bbbcd3ef-0021-42ca-8d32-8796bd1cf670.png" alt="MTFoP Logo" className="h-16 w-auto hover-scale transition-transform duration-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-center animate-fade-in">Authentification</CardTitle>
        <CardDescription className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
          Connectez-vous ou créez un compte pour accéder à la plateforme
        </CardDescription>
      </CardHeader>
      
      <div className="grid w-full grid-cols-2 p-4">
        <Button variant={view === 'login' || view === 'forgot_password' ? 'default' : 'ghost'} onClick={() => setView('login')} className="rounded-r-none">Connexion</Button>
        <Button variant={view === 'signup' ? 'default' : 'ghost'} onClick={() => setView('signup')} className="rounded-l-none">Inscription</Button>
      </div>

      {view === 'login' && renderLogin()}
      {view === 'signup' && renderSignup()}
      {view === 'forgot_password' && renderForgotPassword()}

      {(view === 'forgot_password' || view === 'signup') && (
        <div className="p-4 pt-0 text-center">
          <Button variant="link" onClick={() => setView('login')}>Retour à la connexion</Button>
        </div>
      )}
    </Card>
  );
};

export default SupabaseLoginForm;
