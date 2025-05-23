import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ContinentPage from "./pages/ContinentPage";
import CountryPage from "./pages/CountryPage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import QuizResults from "./pages/QuizResults";
import Passport from "./pages/Passport";
import { FavoritesProvider } from "./context/FavoritesContext";
import FavoritesPage from "./pages/FavoritesPage";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route that redirects authenticated users
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const App = () => {
  useEffect(() => {
    // Create audio object once
    
    const clickSound = new Audio("/sounds/mixkit-select-click-1109.wav");

    // Click handler function
    const playClickSound = () => {
      // Reset sound to beginning if it's already playing
      clickSound.currentTime = 0;
      clickSound.play().catch((err) => {
        console.log("Audio play prevented:", err);
      });
    };

    document.addEventListener("click", playClickSound);
    return () => document.removeEventListener("click", playClickSound);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/countries/:id" element={<CountryPage />} />
            <Route path="/countries/name/:name" element={<CountryPage />} />
            <Route
              path="/continents/:continentName"
              element={<ContinentPage />}
            />
            <Route path="/continents/:id" element={<Home />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
