import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchAllCountries } from "../../services/countriesService";

const QuizCard = ({ question, onAnswer, showNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [displayOptions, setDisplayOptions] = useState([]);

  // Process options once when question changes
  useEffect(() => {
    const prepareOptions = async () => {
      let options = [...question.options]; // Create a new array to avoid mutation

      if (question.type === "region") {
        try {
          // First get the correct answer's region
          const correctRegion = question.correctAnswer.region;

          // Get all unique regions from the API rather than hardcoding
          const countries = await fetchAllCountries();
          const allRegions = [
            ...new Set(countries.map((country) => country.region)),
          ]
            .filter((region) => region) // Filter out undefined/null regions
            .map((region) => ({ region })); // Format like our option objects

          // Create a set of unique region options starting with the correct answer
          const uniqueRegions = new Set();
          uniqueRegions.add(correctRegion);

          // Add random regions until we have 4 unique options
          while (uniqueRegions.size < 4 && allRegions.length > 0) {
            const randomIndex = Math.floor(Math.random() * allRegions.length);
            const randomRegion = allRegions[randomIndex].region;
            uniqueRegions.add(randomRegion);
            // Remove this region to avoid trying it again
            allRegions.splice(randomIndex, 1);
          }

          // Convert unique regions back to array of option objects
          options = Array.from(uniqueRegions).map((region) => {
            // If this is the correct region, use the actual correct answer object
            if (region === correctRegion) {
              return question.correctAnswer;
            }
            // Otherwise create a new option with just the region
            return { region };
          });

          // Shuffle the options ONCE
          options.sort(() => 0.5 - Math.random());
        } catch (error) {
          console.error("Error preparing region options:", error);
          // Fallback to original options if API call fails
        }
      }

      // Set the display options once and don't change them again for this question
      setDisplayOptions(options);
    };

    prepareOptions();

    // Reset states for new question
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [question]); // Only run when question changes

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

  // Get the text to display for each option
  const getOptionText = (option) => {
    if (question.type === "flag") return option.name?.common;
    if (question.type === "capital") return option.capital?.[0] || "No capital";
    if (question.type === "region") return option.region;
    return option.name?.common;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white/10 to-indigo-900/40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 relative overflow-hidden"
    >
      {/* White shimmer overlay */}
      <div className="absolute inset-0 bg-white/5"></div>

      {/* Background decorations */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-400/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>

      {/* Question section */}
      <div className="mb-6 text-center relative z-10">
        <div className="inline-block px-4 py-1 rounded-full bg-indigo-700/50 border border-indigo-500/30 text-yellow-300 text-sm font-medium mb-3">
          {question.type === "flag"
            ? "🚩 Flag Challenge"
            : question.type === "capital"
            ? "🏙️ Capital City Quiz"
            : question.type === "region"
            ? "🗺️ Region Explorer"
            : "🌍 Country Quest"}
        </div>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
          {question.question}
        </h2>

        {question.image && (
          <div className="flex justify-center mb-4">
            <motion.img
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={question.image}
              alt="Question Image"
              className="h-32 object-cover rounded-lg shadow-lg border-2 border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* Options grid - using the stably displayed options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        {displayOptions.map((option, index) => {
          // Determine option styling based on selection and correctness
          let optionClass =
            "p-4 rounded-xl cursor-pointer transition-all duration-300 text-center ";

          if (showFeedback) {
            if (option === question.correctAnswer) {
              optionClass +=
                "bg-gradient-to-r from-green-500/70 to-green-600/70 text-white border-2 border-green-400 shadow-md shadow-green-500/20";
            } else if (option === selectedOption) {
              optionClass +=
                "bg-gradient-to-r from-red-500/70 to-red-600/70 text-white border-2 border-red-400 shadow-md shadow-red-500/20";
            } else {
              optionClass +=
                "bg-indigo-800/30 text-gray-400 border border-indigo-700/30";
            }
          } else {
            optionClass +=
              "bg-indigo-800/50 text-white hover:bg-indigo-700/70 border-2 border-indigo-600/30 hover:border-indigo-500/50 shadow-md hover:shadow-lg hover:shadow-indigo-500/10";
          }

          return (
            <motion.div
              key={index}
              whileHover={{ scale: showFeedback ? 1 : 1.03 }}
              whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              onClick={() => handleOptionSelect(option)}
              className={optionClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            >
              <div className="flex items-center justify-center h-full">
                {/* Star icon for options - only show before answering */}
                {!showFeedback && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 text-xs">
                    ✨
                  </span>
                )}

                <span className="font-medium">{getOptionText(option)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feedback section */}
      {showFeedback && (
        <motion.div className="mt-6 text-center relative z-10">
          <div
            className={`text-xl font-bold mb-2 ${
              isCorrect ? "text-green-400" : "text-red-400"
            } flex items-center justify-center gap-2`}
          >
            {isCorrect ? (
              <>
                <span className="text-2xl">✓</span>
                <span>Amazing! That's correct!</span>
                <span className="text-2xl">🎉</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✗</span>
                <span>Not quite right!</span>
              </>
            )}
          </div>

          {!isCorrect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white mt-2 p-3 bg-indigo-800/30 rounded-lg border border-indigo-600/30"
            >
              The correct answer was:
              <span className="font-bold text-yellow-300 ml-1">
                {getOptionText(question.correctAnswer)}
              </span>
            </motion.div>
          )}

          {isCorrect && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-yellow-300 text-xl mt-1"
            >
              +1 Point! 🌟
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizCard;
