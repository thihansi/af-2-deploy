import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomCountries, generateQuizQuestion, saveQuizResult } from '../services/quizService';
import QuizCard from '../components/QuizCard';
import { useAuth } from '../context/AuthContext';

const QuizPage = () => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [saveStatus, setSaveStatus] = useState(null);
  const totalQuestions = 10;

  useEffect(() => {
    console.log('Authentication status:', { 
      isAuthenticated, 
      user,
      token: localStorage.getItem('accessToken')
    });
  }, [isAuthenticated, user]);

  // Fetch countries and generate quiz questions
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const fetchedCountries = await getRandomCountries(30); // Get 30 random countries
        setCountries(fetchedCountries);
        
        // Generate all quiz questions at once
        const generatedQuestions = Array.from({ length: totalQuestions }, (_, i) => 
          generateQuizQuestion(fetchedCountries, i)
        );
        
        setQuestions(generatedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing quiz:", error);
        setLoading(false);
      }
    };

    initializeQuiz();
  }, []);

  // Handle when user answers a question
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  // Go to next question
  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setShowNextButton(false);
    } else {
      setQuizComplete(true);
    }
  };

  // Restart quiz
  const restartQuiz = async () => {
    setLoading(true);
    setQuizComplete(false);
    setScore(0);
    setCurrentQuestion(0);
    setShowNextButton(false);
    
    try {
      const fetchedCountries = await getRandomCountries(30);
      setCountries(fetchedCountries);
      
      const generatedQuestions = Array.from({ length: totalQuestions }, (_, i) => 
        generateQuizQuestion(fetchedCountries, i)
      );
      
      setQuestions(generatedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error restarting quiz:", error);
      setLoading(false);
    }
  };

  // Save quiz results when quiz completes
  useEffect(() => {
    const saveQuizResults = async () => {
        if (quizComplete && isAuthenticated) {
          try {
            setSaveStatus('saving');
            
            // Create a simplified version to avoid sending huge country objects
            const simplifiedQuestions = questions.map(q => ({
              type: q.type,
              question: q.question,
              correctAnswer: q.type === 'flag' 
                ? q.correctAnswer.name.common 
                : (q.type === 'capital' ? q.correctAnswer.capital?.[0] : q.correctAnswer.name.common)
            }));
            
            const quizData = {
              score,
              totalQuestions,
              correctAnswers: score,
              questions: simplifiedQuestions // Use the simplified version
            };
            
            console.log('Sending simplified quiz data:', quizData);
            
            await saveQuizResult(quizData);
            setSaveStatus('success');
          } catch (error) {
            console.error('Failed to save quiz results:', error);
            setSaveStatus('error');
          }
        }
      };
    
    if (quizComplete) {
      saveQuizResults();
    }
  }, [quizComplete, isAuthenticated, score, totalQuestions, questions]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center galaxy-bg">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl">Loading quiz questions...</div>
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 galaxy-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">World Explorer Quiz</h1>
          <p className="text-indigo-200">Test your knowledge of countries around the world!</p>
          
          {/* Progress bar */}
          <div className="mt-6 mb-8 relative">
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-indigo-900/40">
              <div
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
              ></div>
            </div>
            <div className="mt-2 text-white text-sm">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>
        </header>

        {!quizComplete ? (
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <QuizCard 
                key={currentQuestion} 
                question={questions[currentQuestion]} 
                onAnswer={handleAnswer}
                showNext={() => setShowNextButton(true)} 
              />
            </AnimatePresence>
            
            {showNextButton && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center"
              >
                <button 
                  onClick={goToNextQuestion}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all"
                >
                  {currentQuestion === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-900/40 backdrop-blur-md rounded-xl p-8 shadow-lg border border-indigo-500/30 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
            <div className="text-6xl font-bold text-indigo-300 mb-6">{score}/{totalQuestions}</div>
            
            <div className="mb-8">
              <p className="text-xl text-white">
                {score === totalQuestions ? "Perfect score! You're a geography expert!" : 
                 score >= totalQuestions * 0.8 ? "Excellent! You know your world geography!" :
                 score >= totalQuestions * 0.6 ? "Good job! You have solid geography knowledge!" : 
                 score >= totalQuestions * 0.4 ? "Not bad! Keep exploring to learn more!" :
                 "Keep learning! The world has so much to explore!"}
              </p>
            </div>
            
            {!isAuthenticated && (
              <div className="mb-8 p-4 bg-indigo-800/50 rounded-lg">
                <p className="text-white">Sign in to save your quiz results and track your progress!</p>
              </div>
            )}

            {isAuthenticated && (
              <div className="mt-4">
                {saveStatus === 'saving' && <p className="text-blue-300">Saving your results...</p>}
                {saveStatus === 'success' && <p className="text-green-300">Results saved successfully!</p>}
                {saveStatus === 'error' && <p className="text-red-300">Failed to save results. Please try again.</p>}
              </div>
            )}
            
            <button 
              onClick={restartQuiz}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;