import React, { useState } from 'react';
import { motion } from 'framer-motion';

const QuizCard = ({ question, onAnswer, showNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (option) => {
    if (showFeedback) return; // Prevent multiple selections after answering
    
    setSelectedOption(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Inform parent component about the answer
    onAnswer(correct);

    // Show the next button after a short delay
    setTimeout(() => {
      showNext();
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-indigo-900/40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-500/30"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{question.question}</h2>
        
        {question.image && (
          <div className="flex justify-center mb-4">
            <img 
              src={question.image} 
              alt="Question Image" 
              className="h-32 rounded-md shadow-md border border-gray-200/20" 
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => {
          // Determine option styling based on selection and correctness
          let optionClass = "p-4 rounded-lg cursor-pointer transition-all duration-300 text-center ";
          
          if (showFeedback) {
            if (option === question.correctAnswer) {
              optionClass += "bg-green-500/80 text-white border-2 border-green-400";
            } else if (option === selectedOption) {
              optionClass += "bg-red-500/80 text-white border-2 border-red-400";
            } else {
              optionClass += "bg-indigo-800/50 text-gray-300 hover:bg-indigo-700/50";
            }
          } else {
            optionClass += "bg-indigo-800/50 text-white hover:bg-indigo-700/80 border border-indigo-600/50";
          }
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: showFeedback ? 1 : 1.02 }}
              whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              onClick={() => handleOptionSelect(option)}
              className={optionClass}
            >
              {question.type === 'flag' ? option.name.common : 
               question.type === 'region' ? option.region :
               question.type === 'capital' ? (option.capital?.[0] || 'No capital') : 
               option.name.common}
            </motion.div>
          );
        })}
      </div>
      
      {showFeedback && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <div className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
          </div>
          {!isCorrect && (
            <div className="text-white mt-2">
              The correct answer was: {question.type === 'capital' ? 
                question.correctAnswer.capital?.[0] || 'No capital' : 
                question.correctAnswer.name.common}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizCard;