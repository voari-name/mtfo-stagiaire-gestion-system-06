
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Configuration pour inclure les cookies dans les requêtes
  axios.defaults.withCredentials = true;

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/profile`);
        
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur la plateforme de gestion",
        });
        
        return true;
      } else {
        throw new Error(response.data.message || 'Échec de la connexion');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      setIsAuthenticated(false);
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await axios.get(`${API_URL}/users/logout`);
      
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      
      if (response.data.success) {
        setUser(response.data.user);
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès",
        });
        
        return true;
      } else {
        throw new Error(response.data.message || 'Échec de la mise à jour du profil');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour du profil';
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

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
