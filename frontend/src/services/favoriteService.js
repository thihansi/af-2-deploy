import api from './api';

const favoriteService = {
  // Get all favorite countries
  getFavorites: async () => {
    try {
      console.log('Getting favorites...');
      const response = await api.get('/api/favorites');
      console.log('Favorites response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details for getFavorites:', error);
      throw error;
    }
  },

  // Add a country to favorites
  addFavorite: async (countryCode) => {
    try {
      console.log('Adding favorite with code:', countryCode);
      // Make sure we're sending the right structure to the API
      const response = await api.post('/api/favorites', { countryCode });
      console.log('Add favorite response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details for addFavorite:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      });
      throw error;
    }
  },

  // Remove a country from favorites
  removeFavorite: async (countryCode) => {
    try {
      console.log('Removing favorite with code:', countryCode);
      const response = await api.delete(`/api/favorites/${countryCode}`);
      console.log('Remove favorite response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details for removeFavorite:', error);
      throw error;
    }
  },

  // Toggle favorite status (add or remove)
  toggleFavorite: async (countryCode) => {
    try {
      console.log('Toggling favorite with code:', countryCode);
      const response = await api.post('/api/favorites/toggle', { countryCode });
      console.log('Toggle favorite response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details for toggleFavorite:', error);
      throw error;
    }
  }
};

export default favoriteService;