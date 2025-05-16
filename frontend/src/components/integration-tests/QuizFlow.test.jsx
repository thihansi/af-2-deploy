import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import QuizPage from "../../pages/QuizPage"; 
import { getRandomCountries, submitQuiz } from "../../services/quizService";

// Mock quiz service completely
jest.mock("../../services/quizService", () => ({
  getRandomCountries: jest.fn(),
  generateQuizQuestion: jest.fn(),
  submitQuiz: jest.fn()
}));

// Mock api manually to avoid import.meta issues
jest.mock("../../services/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  defaults: {
    headers: {
      common: {}
    }
  }
}));

describe("Quiz Flow Integration", () => {
  const mockCountries = [
    { 
      name: { common: 'France' }, 
      capital: ['Paris'], 
      flags: { png: 'france.png' },
      region: 'Europe'
    },
    { 
      name: { common: 'Germany' }, 
      capital: ['Berlin'], 
      flags: { png: 'germany.png' },
      region: 'Europe'
    },
    { 
      name: { common: 'Japan' }, 
      capital: ['Tokyo'], 
      flags: { png: 'japan.png' },
      region: 'Asia'
    },
    { 
      name: { common: 'Brazil' }, 
      capital: ['Brasília'], 
      flags: { png: 'brazil.png' },
      region: 'Americas'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getRandomCountries.mockResolvedValue(mockCountries);
    submitQuiz.mockResolvedValue({ score: 8, total: 10 });
  });

  it('loads quiz questions successfully', async () => {
    renderWithProviders(<QuizPage />);
    
    // Verify initial loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Verify quiz content is displayed
    expect(screen.getByText(/quiz/i)).toBeInTheDocument();
  });
  
  it('allows answering questions and navigating through quiz', async () => {
    renderWithProviders(<QuizPage />);
    
    // Wait for quiz to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Answer first question (assuming there are answer options available)
    const answerOptions = screen.getAllByRole('button').filter(button => 
      !button.textContent.includes('Next') && 
      !button.textContent.includes('Submit')
    );
    
    expect(answerOptions.length).toBeGreaterThan(0);
    fireEvent.click(answerOptions[0]);
    
    // Look for the next button and click it
    const nextButton = await screen.findByText(/next/i);
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
    
    // Verify we moved to next question
    expect(screen.getByText(/question/i)).toBeInTheDocument();
  });
  
  it('completes full quiz and shows results', async () => {
    renderWithProviders(<QuizPage />);
    
    // Wait for quiz to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Loop to answer all questions (assuming max 10 questions)
    for (let i = 0; i < 10; i++) {
      // Find available answer buttons
      const answerOptions = screen.getAllByRole('button').filter(button => 
        !button.textContent.includes('Next') && 
        !button.textContent.includes('Submit')
      );
      
      if (answerOptions.length === 0) break; // No more questions
      
      // Select an answer
      fireEvent.click(answerOptions[0]);
      
      // Click next or submit (whichever is available)
      const nextButton = screen.queryByText(/next/i);
      const submitButton = screen.queryByText(/submit|finish/i);
      
      if (submitButton) {
        fireEvent.click(submitButton);
        break;
      } else if (nextButton) {
        fireEvent.click(nextButton);
      } else {
        break; // Neither button found, must be done
      }
    }
    
    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText(/score|result|complete/i)).toBeInTheDocument();
    });
    
    // Check if submit was called
    expect(submitQuiz).toHaveBeenCalled();
  });
  
  it('handles errors during quiz loading', async () => {
    getRandomCountries.mockRejectedValue(new Error('Failed to fetch'));
    
    renderWithProviders(<QuizPage />);
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error|failed|unable/i)).toBeInTheDocument();
    });
  });
});