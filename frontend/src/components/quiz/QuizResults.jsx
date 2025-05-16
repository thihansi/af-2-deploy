import React from 'react';
import { motion } from 'framer-motion';

const QuizResults = ({ score, totalQuestions, restartQuiz, isAuthenticated, saveStatus }) => {
  // Helper functions for reactions and messages
  const getCharacterReaction = () => {
    const percentage = score / totalQuestions;
    
    if (percentage === 1) return "🏆";
    if (percentage >= 0.8) return "🤩";
    if (percentage >= 0.6) return "😄";
    if (percentage >= 0.4) return "🙂";
    return "😊";
  };

  const getMessage = () => {
    if (score === totalQuestions) return "WOW! Perfect score! You're a superstar explorer! 🌟";
    if (score >= totalQuestions * 0.8) return "Amazing job! You're a geography genius! ✨";
    if (score >= totalQuestions * 0.6) return "Great work, explorer! Keep discovering! 🚀";
    if (score >= totalQuestions * 0.4) return "Nice exploring! Try again for an even higher score! 🌍";
    return "Keep exploring! The universe of knowledge awaits you! 🌠";
  };

  const getFunFact = () => {
    const facts = [
      "There are 195 countries in the world today!",
      "The Pacific Ocean is the largest ocean on Earth!",
      "Russia is the largest country by land area!",
      "Vatican City is the smallest country in the world!",
      "The longest border in the world is between Canada and the USA!"
    ];
    
    // Choose fact based on score or randomly
    return facts[Math.min(Math.floor(score / 3), facts.length - 1)];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-indigo-900/60 backdrop-blur-md rounded-2xl p-8 shadow-xl border-2 border-indigo-500/50 text-center relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-yellow-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          {getCharacterReaction()}
        </motion.div>
        
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-300 mb-6"
        >
          Adventure Complete!
        </motion.h2>
        
        <motion.div 
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-6xl font-bold mb-6 flex justify-center items-center gap-2"
        >
          <span className="text-purple-300">{score}</span>
          <span className="text-blue-300">/</span>
          <span className="text-indigo-300">{totalQuestions}</span>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-xl text-white">
            {getMessage()}
          </p>
        </motion.div>
        
        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-6 p-4 rounded-xl bg-indigo-800/50 border border-indigo-500/30"
        >
          <p className="text-blue-200">
            <span className="font-bold">Fun fact:</span> {getFunFact()}
          </p>
        </motion.div>
        
        {/* Sign in message */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6 p-4 rounded-xl bg-purple-800/50 border border-purple-500/30"
          >
            <p className="text-white">Sign in to save your high scores and earn badges! 🏅</p>
          </motion.div>
        )}

        {/* Save status */}
        {isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            {saveStatus === 'saving' && (
              <div className="flex justify-center items-center gap-2 text-blue-300">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Saving your adventure results...</p>
              </div>
            )}
            {saveStatus === 'success' && <p className="text-green-300">Adventure saved! 🎉</p>}
            {saveStatus === 'error' && <p className="text-red-300">Oops! Couldn't save your adventure. Try again!</p>}
          </motion.div>
        )}
        
        {/* Restart button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button 
            onClick={restartQuiz}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 
                    text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105
                    border-2 border-yellow-400/30 text-lg"
          >
            New Adventure! 🚀
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuizResults;