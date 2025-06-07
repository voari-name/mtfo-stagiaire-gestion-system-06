import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth();
  const { toast } = useToast();

  // Créer un utilisateur admin par défaut au démarrage
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        console.log("Vérification de la connexion au serveur...");
        console.log("API URL utilisé:", API_URL);
        
        // Vérifier la connexion au serveur
        await axios.get(`${API_URL}/users/profile`).catch(() => {
          // C'est normal que cette requête échoue si on n'est pas connecté
        });
        
        // Créer l'utilisateur admin par défaut
        try {
          console.log("Création de l'utilisateur admin...");
          await axios.post(`${API_URL}/users/register`, {
            username: "RAHAJANIAINA",
            password: "Olivier",
            firstName: "Olivier",
            lastName: "RAHAJANIAINA", 
            email: "admin@mtfop.mg",
            role: "admin"
          });
          console.log("Utilisateur admin créé avec succès");
          toast({
            title: "Initialisation",
            description: "Utilisateur admin créé avec succès",
          });
        } catch (err: any) {
          if (err.response?.status === 400 && err.response?.data?.message?.includes('déjà utilisé')) {
            console.log("L'utilisateur admin existe déjà");
          } else {
            console.error("Erreur lors de la création de l'admin:", err);
          }
        }
      } catch (err: any) {
        console.error("Erreur de connexion au serveur:", err);
        if (err.code === 'ERR_NETWORK') {
          toast({
            title: "Erreur de connexion",
            description: `Vérifiez que le serveur backend est démarré sur ${API_URL}`,
            variant: "destructive"
          });
        }
      } finally {
        setInitializing(false);
      }
    };
    
    initializeAdmin();
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de connexion avec:", username);
    const success = await login(username, password);
    if (success) {
      navigate("/profile");
    }
  };

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers le profil
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Banner MTFoP */}
      <div className="w-full bg-gradient-to-r from-red-600 via-white to-green-600 p-3 shadow-lg animate-fade-in">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gold font-semibold">REPOBLIKAN'I MADAGASIKARA</p>
          </div>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/bbbcd3ef-0021-42ca-8d32-8796bd1cf670.png" 
              alt="MTFoP Logo" 
              className="h-16 w-auto animate-scale-in"
            />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-800">MTFoP</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="absolute top-20 left-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover-scale transition-all duration-300 animate-slide-in-right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Retour à l'accueil
          </Button>
        </div>
        
        <Card className="w-full max-w-md mx-4 shadow-2xl border-t-4 border-t-blue-800 animate-scale-in">
          <CardHeader className="space-y-1 flex items-center flex-col">
            <div className="flex justify-center mb-4 animate-fade-in">
              <img 
                src="/lovable-uploads/bbbcd3ef-0021-42ca-8d32-8796bd1cf670.png" 
                alt="MTFoP Logo" 
                className="h-16 w-auto hover-scale transition-transform duration-300"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center animate-fade-in">Connexion</CardTitle>
            <CardDescription className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              Entrez vos identifiants pour accéder à la plateforme
            </CardDescription>
            {initializing && (
              <div className="animate-pulse text-center text-sm text-blue-600 mt-2">
                Initialisation en cours...
              </div>
            )}
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="transition-all duration-300 focus:scale-105"
                  disabled={loading || initializing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-300 focus:scale-105"
                  disabled={loading || initializing}
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm animate-fade-in">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Button 
                type="submit" 
                className="w-full bg-blue-800 hover:bg-blue-900 hover-scale transition-all duration-300"
                disabled={loading || initializing}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
