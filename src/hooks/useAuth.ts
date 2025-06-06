
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.defaults.withCredentials = true;

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePhoto?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fonction de connexion
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password
      });

      if (response.data.success) {
        setUser(response.data.user);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur la plateforme de gestion",
        });
        
        navigate('/profile');
        return true;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      
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
  const logout = async () => {
    try {
      await axios.get(`${API_URL}/users/logout`);
      setUser(null);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  // Fonction pour vérifier si l'utilisateur est connecté
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users/profile`);
      
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      }
    } catch (err) {
      console.error('Non authentifié:', err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (userData: Partial<User>) => {
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
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du profil';
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

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    updateProfile
  };
};
