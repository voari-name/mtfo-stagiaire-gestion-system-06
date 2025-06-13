
import axios from 'axios';

// Détection de l'environnement
const isDevelopment = import.meta.env.DEV;
const isLocalhost = window.location.hostname === 'localhost';

// Configuration des URLs API selon l'environnement
export const API_URL = (() => {
  // Si on est en développement local
  if (isDevelopment && isLocalhost) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }
  
  // Si on est en production ou déployé
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback pour le déploiement
  return '/api';
})();

// Configuration pour inclure les cookies dans les requêtes
axios.defaults.withCredentials = true;

// Intercepteur pour gérer les erreurs réseau
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log des erreurs pour le debugging
    console.error('Erreur API:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Ne pas rejeter l'erreur, la laisser passer pour être gérée par les composants
    return Promise.reject(error);
  }
);

console.log('Configuration API initialisée:', {
  API_URL,
  isDevelopment,
  isLocalhost,
  env: import.meta.env.MODE
});
