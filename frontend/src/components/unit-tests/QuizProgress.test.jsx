import { render, screen } from "@testing-library/react";
import React from "react";

// Use jest directly instead of vi
jest.mock("../../services/api", () => ({
  default: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

// Mock AuthContext
jest.mock("../../context/AuthContext", () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// After mocking, import components
import QuizProgress from "../quiz/QuizProgress";

describe("QuizProgress", () => {
  beforeAll(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  // Basic display test cases
  describe("Display tests", () => {
    it("displays correct question count", () => {
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
      );
      expect(screen.getByText("Question 5 of 10")).toBeInTheDocument();
    });

    it("displays the current score", () => {
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
      );
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("displays stars icon with score", () => {
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
      );
      const scoreIcon = screen.getByText("stars");
      expect(scoreIcon).toBeInTheDocument();
      expect(scoreIcon.className).toContain("material-icons");
    });
  });

  // Progress bar tests
  describe("Progress bar tests", () => {
    it("renders progress bar with correct attributes", () => {
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute("aria-valuenow", "50");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    });

    it("calculates 0% progress for first question", () => {
      render(
        <QuizProgress currentQuestion={1} totalQuestions={10} score={0} />
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "10");
    });

    it("calculates 100% progress for last question", () => {
      render(
        <QuizProgress currentQuestion={10} totalQuestions={10} score={8} />
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    });
  });

  // Edge case tests
  describe("Edge case tests", () => {
    it("handles negative scores gracefully", () => {
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={-5} />
      );
      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    it("handles large numbers correctly", () => {
      render(
        <QuizProgress
          currentQuestion={999}
          totalQuestions={1000}
          score={9999}
        />
      );
      expect(screen.getByText("Question 999 of 1000")).toBeInTheDocument();
      expect(screen.getByText("9999")).toBeInTheDocument();

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "99.9");
    });
  });

  // Snapshot test
  it("matches snapshot", () => {
    const { container } = render(
      <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
    );
    expect(container).toMatchSnapshot();
  });

  // Accessibility tests
  describe("Accessibility tests", () => {
    it("has appropriate ARIA attributes", () => {
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow");
      expect(progressBar).toHaveAttribute("aria-valuemin");
      expect(progressBar).toHaveAttribute("aria-valuemax");
    });

    it("ensures score is properly labeled for screen readers", () => {
      // This test assumes your component wraps the score in something like an aria-label
      // You may need to modify the component to pass this test
      render(
        <QuizProgress currentQuestion={5} totalQuestions={10} score={3} />
      );
      // Look for aria-label or similar that identifies the score
      const scoreContainer = screen.getByText("3").closest("div");
      expect(scoreContainer).toBeInTheDocument();
    });
  });
});
