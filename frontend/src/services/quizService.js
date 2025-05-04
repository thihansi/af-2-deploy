import axios from "axios";
import api from "./api"; // Use your configured axios instance with interceptors

const API_URL = "https://restcountries.com/v3.1";

// Get a set of random countries for the quiz
export const getRandomCountries = async (count = 20) => {
  try {
    // Fetch all countries first
    const response = await axios.get(
      `${API_URL}/all?fields=name,capital,flags,region,population,currencies`
    );
    const countries = response.data;

    // Shuffle array and take the requested count
    const shuffled = countries.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    throw new Error("Error fetching quiz countries: " + error.message);
  }
};

// Generate a quiz question with multiple choices
export const generateQuizQuestion = (countries, questionIndex) => {
  // Types of questions we can ask
  const questionTypes = [
    {
      type: "capital",
      question: (country) => `What is the capital of ${country.name.common}?`,
    },
    {
      type: "flag",
      question: (country) => `Which country does this flag belong to?`,
    },
    {
      type: "country",
      question: (country) =>
        `Which country has ${country.capital?.[0] || "no capital"}?`,
    },
    {
      type: "region",
      question: (country) =>
        `In which region is ${country.name.common} located?`,
    },
  ];

  // Select a random question type
  const randomType = questionTypes[questionIndex % questionTypes.length];

  // Select a correct country for the question
  const correctCountry = countries[questionIndex];

  // Get 3 random wrong answers
  const wrongOptions = countries
    .filter((c) => c !== correctCountry)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Combine answers and shuffle
  const options = [correctCountry, ...wrongOptions].sort(
    () => 0.5 - Math.random()
  );

  // Create and return the question object
  return {
    id: questionIndex,
    type: randomType.type,
    question: randomType.question(correctCountry),
    options,
    correctAnswer: correctCountry,
    image: randomType.type === "flag" ? correctCountry.flags.png : null,
  };
};

// Save quiz result to the backend (if you want to track stats)
export const saveQuizResult = async (quizData) => {
  try {
    // Use the api instance which already has auth handling
    const response = await api.post("/api/quiz/results", quizData);
    return response.data;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }
};

// Fetch quiz results for the authenticated user
export const getUserQuizResults = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/results`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz results');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  };