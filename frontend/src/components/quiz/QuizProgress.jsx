import React from 'react';
import { motion } from 'framer-motion';

const QuizProgress = ({ currentQuestion, totalQuestions, score }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="mb-6 text-white">
      <div className="flex justify-between items-center mb-2">
        <div>Question {currentQuestion} of {totalQuestions}</div>
        <div className="flex items-center">
          <span className="material-icons mr-1">stars</span>
          <span>{score}</span>
        </div>
      </div>
      
      <div className="bg-indigo-800/30 rounded-full h-3 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;