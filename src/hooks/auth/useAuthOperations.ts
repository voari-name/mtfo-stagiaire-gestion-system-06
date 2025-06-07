
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/config/api';
import type { User } from '@/types/auth';

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentative de connexion vers:", `${API_URL}/users/login`);
      console.log("Données envoyées:", { username, password: "***" });

      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password
      });

      console.log("Réponse du serveur:", response.data);

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
      console.error("Erreur de connexion:", err);
      console.error("Détails de l'erreur:", err.response?.data);
      
      let errorMessage = 'Erreur lors de la connexion';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = `Erreur réseau: Vérifiez que le serveur backend est démarré sur ${API_URL}`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
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

  return {
    loading,
    login,
    logout,
    updateProfile
  };
};
