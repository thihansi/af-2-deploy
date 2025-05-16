import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizCard from "../../components/quiz/QuizCard";
import { renderWithProviders } from "../../utils/test-utils";

// Mock the API module to avoid real network calls during tests
jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  },
}));

describe("QuizCard Component", () => {
  // Setup common test data
  const correctOption = { name: { common: "France" }, capital: ["Paris"] };
  const mockQuestion = {
    type: "capital",
    question: "What is the capital of France?",
    options: [
      correctOption,
      { name: { common: "Germany" }, capital: ["Berlin"] },
      { name: { common: "Spain" }, capital: ["Madrid"] },
      { name: { common: "Italy" }, capital: ["Rome"] },
    ],
    correctAnswer: correctOption,
  };

  // Helper function to render the component with common props
  const renderComponent = (props = {}) => {
    return renderWithProviders(
      <QuizCard
        question={mockQuestion}
        onAnswer={() => {}}
        showNext={() => {}}
        {...props}
      />
    );
  };

  // RENDERING TESTS
  describe("Rendering", () => {
    it("renders the quiz question text correctly", () => {
      renderComponent();
      expect(
        screen.getByText("What is the capital of France?")
      ).toBeInTheDocument();
    });

    it("renders all answer options", () => {
      renderComponent();
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("Berlin")).toBeInTheDocument();
      expect(screen.getByText("Madrid")).toBeInTheDocument();
      expect(screen.getByText("Rome")).toBeInTheDocument();
    });
  });

  // INTERACTION TESTS
  describe("User Interactions", () => {
    it("calls onAnswer with true when correct answer is selected", () => {
      const onAnswerMock = jest.fn();
      renderComponent({ onAnswer: onAnswerMock });

      // Click the correct option
      fireEvent.click(screen.getByText("Paris"));

      // Assert callback received `true`
      expect(onAnswerMock).toHaveBeenCalledWith(true);
    });

    it("calls onAnswer with false when incorrect answer is selected", () => {
      const onAnswerMock = jest.fn();
      renderComponent({ onAnswer: onAnswerMock });

      // Click an incorrect option
      fireEvent.click(screen.getByText("Berlin"));

      // Assert callback received `false`
      expect(onAnswerMock).toHaveBeenCalledWith(false);
    });
  });
});
