import express from 'express';
import { register, login, logout, refreshToken, getMe, checkAuthStatus } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh-token', refreshToken);
router.get('/me', protect, getMe);
router.get('/status', protect, checkAuthStatus);

export default router;
