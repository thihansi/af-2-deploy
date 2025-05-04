import { quizResultModel as QuizResult } from '../models/quizResultSchema.js';

// Save a new quiz result
export const saveQuizResult = async (req, res) => {
  try {
    // Log data for debugging
    console.log('Saving quiz result:', req.body);
    console.log('User ID from request:', req.userId); // Use this instead of req.user
    
    const { score, totalQuestions, correctAnswers, questions } = req.body;
    
    // Create new quiz result
    const newQuizResult = new QuizResult({
      userId: req.userId, // CHANGED FROM req.user._id
      score,
      totalQuestions,
      correctAnswers,
      questions: questions || []
    });
    
    // Save to database
    const savedResult = await newQuizResult.save();
    
    res.status(201).json({
      success: true,
      data: savedResult
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error saving quiz result'
    });
  }
};

// Get all quiz results for a user
export const getUserQuizResults = async (req, res) => {
  try {
    // Changed from req.user._id to req.userId 
    const results = await QuizResult.find({ userId: req.userId })
      .sort({ quizDate: -1 });
      
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    // Rest of the error handling remains the same
  }
};