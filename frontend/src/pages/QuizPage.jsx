import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { getRandomCountries, generateQuizQuestion, saveQuizResult } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

import Navbar from '../components/Navbar';
import SkyBackground from '../components/backgrounds/SkyBackground';
import QuizCard from '../components/quiz/QuizCard';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizResults from '../components/quiz/QuizResults';

const QuizPage = () => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isAuthenticated } = useAuth();
  const [saveStatus, setSaveStatus] = useState(null);
  const totalQuestions = 10;

  // Initialize or restart quiz
  const setupQuiz = async (isRestart = false) => {
    if (isRestart) {
      setQuizComplete(false);
      setScore(0);
      setCurrentQuestion(0);
      setShowNextButton(false);
      setSaveStatus(null);
    }
    
    setLoading(true);
    try {
      const fetchedCountries = await getRandomCountries(30);
      setCountries(fetchedCountries);
      
      const generatedQuestions = Array.from({ length: totalQuestions }, (_, i) => 
        generateQuizQuestion(fetchedCountries, i)
      );
      
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error(`Error ${isRestart ? 'restarting' : 'initializing'} quiz:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Initial quiz setup
  useEffect(() => {
    setupQuiz();
  }, []);

  // Handle answer selection
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  // Go to next question or complete quiz
  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setShowNextButton(false);
    } else {
      setQuizComplete(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  };

  // Save quiz results when completed
  useEffect(() => {
    const saveQuizResults = async () => {
      if (!quizComplete || !isAuthenticated) return;
      
      try {
        setSaveStatus('saving');
        
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
          questions: simplifiedQuestions
        };
        
        await saveQuizResult(quizData);
        setSaveStatus('success');
      } catch (error) {
        console.error('Failed to save quiz results:', error);
        setSaveStatus('error');
      }
    };
    
    saveQuizResults();
  }, [quizComplete, isAuthenticated, questions, score, totalQuestions]);

  // Progress message based on how far along in the quiz
  const getProgressMessage = () => {
    const progressPercent = currentQuestion / totalQuestions;
    
    if (progressPercent < 0.3) return "You're just getting started! 🚀";
    if (progressPercent < 0.6) return "You're doing great! Keep going! 🌟";
    if (progressPercent < 0.9) return "Almost there, space explorer! ✨";
    return "Final questions ahead! You can do it! 🏆";
  };

  // Loading screen
  if (loading) {
    return (
      <SkyBackground>
        <div className="min-h-screen pt-16 md:pt-20">
          <Navbar />
          <div className="pt-12 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-6 text-2xl font-bold">Preparing Your Adventure!</div>
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full bg-indigo-600/30 animate-ping"></div>
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-indigo-700/70">
                  <span className="text-4xl animate-bounce">🚀</span>
                </div>
              </div>
              <div className="mt-6 text-lg text-blue-200">Loading quiz questions...</div>
            </div>
          </div>
        </div>
      </SkyBackground>
    );
  }

  return (
    <SkyBackground>
      <div className="min-h-screen pt-16 md:pt-20">
        <Navbar />
        
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          {/* Quiz header */}
          <header className="mb-6 text-center">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-400 to-blue-300 mb-2"
            >
              Space Explorer Quiz!
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-indigo-200 text-lg"
            >
              Test your galaxy-sized knowledge of planet Earth!
            </motion.p>
            
            {!quizComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-yellow-200 font-medium"
              >
                {getProgressMessage()}
              </motion.div>
            )}
            
            {/* Progress bar */}
            {!quizComplete && (
              <QuizProgress 
                currentQuestion={currentQuestion} 
                totalQuestions={totalQuestions} 
                score={score}
              />
            )}
          </header>

          {/* Main quiz content */}
          {!quizComplete ? (
            <div className="mb-8 relative">
              {/* Star decoration */}
              <div className="absolute -top-10 -left-10 text-yellow-300 text-opacity-30 text-5xl pointer-events-none">✦</div>
              <div className="absolute -bottom-6 -right-6 text-blue-300 text-opacity-20 text-4xl pointer-events-none">★</div>
              
              {/* Quiz card */}
              <AnimatePresence mode="wait">
                <QuizCard 
                  key={currentQuestion} 
                  question={questions[currentQuestion]} 
                  onAnswer={handleAnswer}
                  showNext={() => setShowNextButton(true)} 
                />
              </AnimatePresence>
              
              {/* Next button */}
              {showNextButton && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <button 
                    onClick={goToNextQuestion}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                             text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all
                             border-2 border-purple-400/30 transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{currentQuestion === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}</span>
                      <span className="text-xl">🚀</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <QuizResults
              score={score}
              totalQuestions={totalQuestions}
              restartQuiz={() => setupQuiz(true)}
              isAuthenticated={isAuthenticated}
              saveStatus={saveStatus}
            />
          )}
        </div>
      </div>
    </SkyBackground>
  );
};

export default QuizPage;