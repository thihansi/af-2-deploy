import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import favoriteService from '../services/favoriteService';
import { toast } from 'react-hot-toast';

// Create context
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Could not load your favorite countries');
    } finally {
      setLoading(false);
    }
  };

  // Check if a country is in favorites
  const isFavorite = (countryCode) => {
    return favorites.includes(countryCode);
  };

  // Add a country to favorites
  const addFavorite = async (countryCode, countryName) => {
    if (!isAuthenticated) return false;
    
    try {
      setLoading(true);
      const updatedFavorites = await favoriteService.addFavorite(countryCode);
      setFavorites(updatedFavorites);
      toast.success(`Added ${countryName || 'country'} to favorites!`);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error(error.response?.data?.message || 'Could not add to favorites');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove a country from favorites
  const removeFavorite = async (countryCode, countryName) => {
    if (!isAuthenticated) return false;
    
    try {
      setLoading(true);
      const updatedFavorites = await favoriteService.removeFavorite(countryCode);
      setFavorites(updatedFavorites);
      toast.success(`Removed ${countryName || 'country'} from favorites`);
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error(error.response?.data?.message || 'Could not remove from favorites');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
// In your toggleFavorite function
const toggleFavorite = async (country) => {
  if (!isAuthenticated) {
    toast.error('Please log in to manage favorites');
    return false;
  }
  
  const countryCode = country.cca3;
  const countryName = country.name.common;
  
  console.log('Authentication status:', isAuthenticated);
  console.log('Token available:', !!localStorage.getItem('accessToken'));
  
  try {
    setLoading(true);
    if (isFavorite(countryCode)) {
      return await removeFavorite(countryCode, countryName);
    } else {
      return await addFavorite(countryCode, countryName);
    }
  } catch (error) {
    console.error('Toggle favorite failed:', error);
    toast.error('Could not update favorites. Network issue or server problem.');
    return false;
  } finally {
    setLoading(false);
  }
};
  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => useContext(FavoritesContext);