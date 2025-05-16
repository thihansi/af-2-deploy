import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaUsers, 
  FaLanguage, 
  FaMoneyBillWave, 
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle 
} from 'react-icons/fa';

const FunFactsQuiz = ({ country }) => {
  const [quizItems, setQuizItems] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Generate quiz questions and answers
  useEffect(() => {
    const facts = [];
    
    // Capital fact
    if (country.capital && country.capital.length > 0) {
      facts.push({
        id: 'capital',
        icon: <FaMapMarkerAlt className="text-2xl text-yellow-400" />,
        question: `What is the capital of ${country.name.common}?`,
        answer: country.capital[0],
      });
    }
    
    // Population fact
    if (country.population) {
      const populationMillions = (country.population / 1000000).toFixed(2);
      facts.push({
        id: 'population',
        icon: <FaUsers className="text-2xl text-pink-400" />,
        question: `How many million people live in ${country.name.common}?`,
        answer: `${populationMillions} million`,
      });
    }
    
    // Language fact
    if (country.languages && Object.keys(country.languages).length > 0) {
      const languageList = Object.values(country.languages);
      if (languageList.length > 0) {
        facts.push({
          id: 'language',
          icon: <FaLanguage className="text-2xl text-purple-400" />,
          question: `What language is spoken in ${country.name.common}?`,
          answer: languageList.length === 1 
            ? languageList[0] 
            : `${languageList[0]} and ${languageList.length-1} more`,
        });
      }
    }
    
    // Currency fact
    if (country.currencies && Object.keys(country.currencies).length > 0) {
      const currencyCode = Object.keys(country.currencies)[0];
      const currency = country.currencies[currencyCode];
      facts.push({
        id: 'currency',
        icon: <FaMoneyBillWave className="text-2xl text-green-400" />,
        question: `What money is used in ${country.name.common}?`,
        answer: `${currency.name} (${currency.symbol || currencyCode})`,
      });
    }
    
    // Continent fact
    if (country.region) {
      facts.push({
        id: 'region',
        icon: <FaGlobe className="text-2xl text-blue-400" />,
        question: `Where is ${country.name.common} located?`,
        answer: `${country.region}${country.subregion ? `, ${country.subregion}` : ''}`,
      });
    }
    
    setQuizItems(facts);
  }, [country]);
  
  // Handle selection of a question
  const handleQuestionClick = (id) => {
    if (matchedPairs.includes(id)) return;
    setSelectedQuestion(id);
    
    // If we have both question and answer selected, check if they match
    if (selectedAnswer) {
      checkMatch(id, selectedAnswer);
    }
  };
  
  // Handle selection of an answer
  const handleAnswerClick = (id) => {
    if (matchedPairs.includes(id)) return;
    setSelectedAnswer(id);
    
    // If we have both question and answer selected, check if they match
    if (selectedQuestion) {
      checkMatch(selectedQuestion, id);
    }
  };
  
  // Check if the selected question and answer match
  const checkMatch = (questionId, answerId) => {
    if (questionId === answerId) {
      // Correct match!
      setMatchedPairs([...matchedPairs, questionId]);
      
      // Reset selections
      setSelectedQuestion(null);
      setSelectedAnswer(null);
      
      // If all matched, show celebration
      if (matchedPairs.length + 1 === quizItems.length) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      // Incorrect match - show brief visual feedback and reset
      setTimeout(() => {
        setSelectedQuestion(null);
        setSelectedAnswer(null);
      }, 800);
    }
  };
  
  // Get class based on selection state
  const getQuestionClass = (id) => {
    if (matchedPairs.includes(id)) return "opacity-50 bg-green-100";
    if (selectedQuestion === id) return "ring-4 ring-blue-400 bg-blue-50";
    return "hover:bg-white/90 cursor-pointer";
  };
  
  const getAnswerClass = (id) => {
    if (matchedPairs.includes(id)) return "opacity-50 bg-green-100";
    if (selectedAnswer === id) return "ring-4 ring-blue-400 bg-blue-50";
    return "hover:bg-white/90 cursor-pointer";
  };
  
  // Reset the game
  const resetGame = () => {
    setMatchedPairs([]);
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setShowCelebration(false);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border-4 border-yellow-400 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-400 rounded-full"></div>
      
      <h2 className="text-2xl font-bold mb-4 text-blue-800 relative z-10 flex items-center">
        <span className="mr-2">🎮</span> {country.name.common} Fun Facts Quiz! <span className="ml-2">🎯</span>
      </h2>
      
      {quizItems.length > 0 && (
        <div className="relative z-10">
          <div className="mb-4 text-center">
            <p className="bg-yellow-100 inline-block px-4 py-2 rounded-full text-yellow-800 font-bold border-2 border-yellow-200">
              {matchedPairs.length === quizItems.length 
                ? "Great job! You matched all the facts! 🎉" 
                : `Match the questions with the correct answers! (${matchedPairs.length}/${quizItems.length})`}
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Questions Column */}
            <div className="space-y-3">
              <h3 className="font-bold text-center text-blue-800 bg-blue-100 py-2 rounded-lg">Questions</h3>
              {quizItems.map((item) => (
                <div 
                  key={`q-${item.id}`}
                  onClick={() => handleQuestionClick(item.id)}
                  className={`flex items-start bg-white/80 p-3 rounded-xl shadow-md 
                    border-2 border-blue-100 transition-all ${getQuestionClass(item.id)}`}
                >
                  <div className="mr-3 mt-1">{item.icon}</div>
                  <p className="text-blue-900 font-medium">{item.question}</p>
                  {matchedPairs.includes(item.id) && (
                    <FaCheckCircle className="ml-auto text-green-500 text-xl" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Answers Column */}
            <div className="space-y-3">
              <h3 className="font-bold text-center text-blue-800 bg-blue-100 py-2 rounded-lg">Answers</h3>
              {/* Shuffle the answers */}
              {quizItems
                .map(item => ({ id: item.id, answer: item.answer }))
                .sort(() => Math.random() - 0.5)
                .map((item) => (
                  <div 
                    key={`a-${item.id}`}
                    onClick={() => handleAnswerClick(item.id)}
                    className={`flex items-center bg-white/80 p-3 rounded-xl shadow-md 
                      border-2 border-purple-100 transition-all ${getAnswerClass(item.id)}`}
                  >
                    <p className="text-purple-900 font-medium">{item.answer}</p>
                    {matchedPairs.includes(item.id) && (
                      <FaCheckCircle className="ml-auto text-green-500 text-xl" />
                    )}
                  </div>
                ))}
            </div>
          </div>
          
          {matchedPairs.length === quizItems.length && (
            <div className="mt-4 text-center">
              <button
                onClick={resetGame}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full transition transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Quiz badge */}
      <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-md z-10">
        Match & Learn!
      </div>
      
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-blue-500/30 backdrop-blur-sm rounded-3xl">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center transform animate-bounce">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Hooray! 🎉</h3>
            <p className="text-blue-800">You're a geography genius!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunFactsQuiz;