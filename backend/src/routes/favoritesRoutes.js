import express from 'express';
import { 
  getUserFavorites, 
  addFavorite, 
  removeFavorite,
  toggleFavorite 
} from '../controllers/favoritesController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Log to verify this file is being loaded
console.log("Favorites routes file loaded");

// All routes are protected - require authentication
router.use(protect);

// Get user's favorite countries
router.get('/', getUserFavorites);

// Add a country to favorites
router.post('/', addFavorite);

// Remove a country from favorites
router.delete('/:countryCode', removeFavorite);

// Toggle favorite status (add if not present, remove if present)
router.post('/toggle', toggleFavorite);

// Add a test endpoint that doesn't require complex logic
router.get('/test', (req, res) => {
  res.json({ message: "Favorites routes are working" });
});

export default router;