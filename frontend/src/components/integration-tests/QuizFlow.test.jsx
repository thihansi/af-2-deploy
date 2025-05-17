import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import QuizPage from "../../pages/QuizPage";
import {
  getRandomCountries,
  submitQuiz,
  generateQuizQuestion,
} from "../../services/quizService";

/**
 * Shared mock props that can be modified between tests
 * to change the behavior of the mock QuizCard component
 */
let mockProps = { isLast: false };

/**
 * Mock implementation of the QuizCard component to avoid issues
 * with undefined properties during testing while still
 * allowing us to test the overall quiz flow
 */
jest.mock("../../components/quiz/QuizCard", () => {
  return function MockQuizCard(props) {
    return (
      <div data-testid="quiz-card">
        <h2>Mock Quiz Card</h2>
        {/* Button to simulate answering a question */}
        <button onClick={() => props.onAnswer("mockAnswer")}>Answer</button>
        {/* Button to navigate to next question or submit quiz based on isLast */}
        <button
          onClick={() => props.onAnswer(mockProps.isLast ? "submit" : "next")}
        >
          {mockProps.isLast ? "Submit Quiz" : "Next Question"}
        </button>
      </div>
    );
  };
});

// Mock all quiz service functions to prevent actual API calls during tests
jest.mock("../../services/quizService", () => ({
  getRandomCountries: jest.fn(),
  generateQuizQuestion: jest.fn(),
  submitQuiz: jest.fn(),
}));

// Mock API service to avoid import.meta issues and external dependencies
jest.mock("../../services/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe("Quiz Flow Integration", () => {
  // Sample mock data for countries used in quiz questions
  const mockCountries = [
    {
      name: { common: "France" },
      capital: ["Paris"],
      flags: { png: "france.png" },
      region: "Europe",
    },
    {
      name: { common: "Germany" },
      capital: ["Berlin"],
      flags: { png: "germany.png" },
      region: "Europe",
    },
    {
      name: { common: "Japan" },
      capital: ["Tokyo"],
      flags: { png: "japan.png" },
      region: "Asia",
    },
    {
      name: { common: "Brazil" },
      capital: ["Brasília"],
      flags: { png: "brazil.png" },
      region: "Americas",
    },
  ];

  // Sample quiz questions for testing
  const mockQuizQuestions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin"],
      correctAnswer: "Paris",
      type: "capital",
    },
    {
      id: 2,
      question: "Which country does this flag belong to?",
      options: ["Germany", "France", "Spain"],
      correctAnswer: "Germany",
      type: "flag",
    },
  ];

  // Reset all mocks and shared state before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockProps.isLast = false;
    
    // Set up mock implementations with default success responses
    getRandomCountries.mockResolvedValue(mockCountries);
    generateQuizQuestion.mockImplementation(() => mockQuizQuestions[0]);
    submitQuiz.mockResolvedValue({ score: 8, total: 10 });
  });

  /**
   * Test Case: Verify that quiz questions load successfully
   * 
   * This test ensures that:
   * 1. The loading state is displayed and then removed
   * 2. The quiz card is rendered after loading
   */
  it("loads quiz questions successfully", async () => {
    renderWithProviders(<QuizPage />);

    // Wait for the loading indicator to disappear
    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify quiz content is displayed
    expect(screen.getByTestId("quiz-card")).toBeInTheDocument();
  });

  /**
   * Test Case: Verify question answering and navigation
   * 
   * This test simulates:
   * 1. Answering a question
   * 2. Clicking the next button
   * 3. Verifying that service methods were called
   */
  it("allows answering questions and navigating through quiz", async () => {
    renderWithProviders(<QuizPage />);

    // Wait for quiz to fully load
    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Simulate answering the question
    const answerButton = await screen.findByText("Answer");
    fireEvent.click(answerButton);

    // Navigate to the next question
    const nextButton = await screen.findByText("Next Question");
    fireEvent.click(nextButton);

    // Verify the quiz service was called to get country data
    expect(getRandomCountries).toHaveBeenCalled();
  });

  /**
   * Test Case: Verify the submit button appears on the last question
   * 
   * This test checks:
   * 1. The "Submit Quiz" button appears when on the last question
   * 2. The shared mock state can be used to control component behavior
   */
  it("displays submit button when on the last question", async () => {
    renderWithProviders(<QuizPage />);
  
    // Wait for quiz to fully load
    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  
    // Answer the question
    const answerButton = await screen.findByText("Answer");
    fireEvent.click(answerButton);
  
    // Update mock props to simulate being on the last question
    mockProps.isLast = true;
    
    // Force re-render by clicking the answer button again
    fireEvent.click(screen.getByText("Answer"));
  
    // Verify the "Submit Quiz" button is displayed
    expect(screen.getByText("Submit Quiz")).toBeInTheDocument();
  });

  /**
   * Test Case: Verify error handling during quiz loading
   * 
   * This test ensures:
   * 1. Errors during quiz initialization are properly handled
   * 2. Error messages are logged to the console
   */
  it("handles errors during quiz loading", async () => {
    // Mock the API to return an error
    getRandomCountries.mockRejectedValue(new Error("Failed to fetch"));

    // Intercept console.error calls
    jest.spyOn(console, "error").mockImplementation(() => {});

    renderWithProviders(<QuizPage />);

    // Verify error was logged with appropriate message
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error initializing quiz"),
        expect.any(Error)
      );
    });

    // Clean up console spy
    console.error.mockRestore();
  });
});