import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://world-explorer-pytx4lrk3-thihansi-gunawardenas-projects.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Add global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;