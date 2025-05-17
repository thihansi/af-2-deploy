import { 
    getFavoriteCountries, 
    addToFavorites, 
    removeFromFavorites 
  } from "../services/favoritesService.js";
  
  export const getUserFavorites = async (req, res) => {
    try {
      const favorites = await getFavoriteCountries(req.userId);
      res.status(200).json(favorites);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const addFavorite = async (req, res) => {
    try {
      const { countryCode } = req.body;
      
      if (!countryCode) {
        return res.status(400).json({ message: "Country code is required" });
      }
      
      const updatedFavorites = await addToFavorites(req.userId, countryCode);
      res.status(201).json(updatedFavorites);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const removeFavorite = async (req, res) => {
    try {
      const { countryCode } = req.params;
      const updatedFavorites = await removeFromFavorites(req.userId, countryCode);
      res.status(200).json(updatedFavorites);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const toggleFavorite = async (req, res) => {
    try {
      const { countryCode } = req.body;
      
      if (!countryCode) {
        return res.status(400).json({ message: "Country code is required" });
      }
      
      // Get current favorites
      const currentFavorites = await getFavoriteCountries(req.userId);
      
      let updatedFavorites;
      if (currentFavorites.includes(countryCode)) {
        // Remove if already in favorites
        updatedFavorites = await removeFromFavorites(req.userId, countryCode);
      } else {
        // Add if not in favorites
        updatedFavorites = await addToFavorites(req.userId, countryCode);
      }
      
      res.status(200).json(updatedFavorites);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };