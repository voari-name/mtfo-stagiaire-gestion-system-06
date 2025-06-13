
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import type { User } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de l'authentification...");
        console.log("API URL utilisé:", API_URL);
        
        // Test de connectivité d'abord
        const healthResponse = await axios.get(`${API_URL}/health`);
        console.log("Serveur accessible:", healthResponse.data);
        
        const response = await axios.get(`${API_URL}/users/profile`);
        
        if (response.data.success) {
          console.log("Utilisateur connecté:", response.data.user);
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          console.log("Aucun utilisateur connecté");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        console.log("Pas d'utilisateur connecté:", err.response?.status);
        
        if (err.code === 'ERR_NETWORK') {
          console.error("ERREUR RÉSEAU: Le serveur backend n'est pas accessible");
          console.error("URL tentée:", API_URL);
          console.error("Vérifiez que:");
          console.error("1. Le serveur backend est démarré");
          console.error("2. MongoDB est accessible");
          console.error("3. Les variables d'environnement sont correctes");
          
          setError("Serveur non accessible. Vérifiez la connexion.");
        }
        
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return {
    user,
    setUser,
    loading,
    error,
    setError,
    isAuthenticated,
    setIsAuthenticated
  };
};
