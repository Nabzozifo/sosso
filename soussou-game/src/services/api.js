import axios from 'axios';

// Configuration de base de l'API Laravel
// Important: utiliser le même hôte que celui des cookies Sanctum (localhost) pour éviter les 401.
const API_BASE_URL = 'http://localhost:8000/api';

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

// Services API
export const apiService = {
  // Endpoint racine - informations générales
  getApiInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer les informations de l\'API');
    }
  },

  // Convertir un nombre en Soussou (POST)
  convertNumber: async (number, formatType = 'csv_data') => {
    try {
      const response = await api.post('/convert', {
        number: parseInt(number),
        format_type: formatType
      });
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la conversion du nombre ${number}`);
    }
  },

  // Convertir un nombre en Soussou (GET)
  convertNumberGet: async (number) => {
    try {
      const response = await api.get(`/convert/${number}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la conversion du nombre ${number}`);
    }
  },

  // Obtenir un nombre aléatoire
  getRandomNumber: async () => {
    try {
      const response = await api.get('/random');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la génération d\'un nombre aléatoire');
    }
  },

  // Générer un nombre par difficulté
  generateNumberByDifficulty: async (difficulty = 'medium') => {
    try {
      const response = await api.get(`/generate/${difficulty}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la génération d'un nombre de difficulté ${difficulty}`);
    }
  },

  // Analyser un nombre en détail
  analyzeNumber: async (number) => {
    try {
      const response = await api.get(`/analyze/${number}`);
      return response.data?.analysis ?? response.data;
    } catch (error) {
      throw new Error(`Erreur lors de l'analyse du nombre ${number}`);
    }
  },

  // Obtenir l'explication détaillée d'un nombre
  getExplanation: async (number) => {
    try {
      const response = await api.get(`/explanation/${number}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'explication du nombre ${number}`);
    }
  },

  // Obtenir les statistiques
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  },

  // Valider une traduction
  validateTranslation: async (number, translation) => {
    try {
      const response = await api.post('/validate', {
        number: parseInt(number),
        translation: translation
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la validation de la traduction');
    }
  },

  // Méthodes de compatibilité avec l'ancien système
  getInfo: async () => {
    return await apiService.getApiInfo();
  },

  translateNumber: async (number, format = 'csv_data') => {
    return await apiService.convertNumberGet(number);
  }
};

export default apiService;