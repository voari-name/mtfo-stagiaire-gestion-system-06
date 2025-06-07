
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration pour inclure les cookies dans les requêtes
axios.defaults.withCredentials = true;
