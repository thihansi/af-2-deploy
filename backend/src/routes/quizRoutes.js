import express from 'express';
import { saveQuizResult, getUserQuizResults } from '../controllers/quizController.js';
import { protect } from '../middlewares/authMiddleware.js'; // add .js extension

const router = express.Router();

// Protected routes - require authentication
router.post('/results', protect, saveQuizResult);
router.get('/results', protect, getUserQuizResults);

export default router;