import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DarkSkyBackground from "../components/backgrounds/DarkSkyBackground";
import Navbar from "../components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear errors when user types
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData);
      navigate("/"); // Redirect to home page on successful login
    } catch (error) {
      setSubmitError(error.message || "Failed to login. Please try again.");
    }
  };

  return (
    <DarkSkyBackground>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-blue-950/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-400/20">
          <div>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
              Welcome Back, Explorer!
            </h2>
            <p className="mt-2 text-center text-sm text-blue-200">
              Or{" "}
              <Link
                to="/signup"
                className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
              >
                begin your adventure with a new account
              </Link>
            </p>
          </div>

          {submitError && (
            <Alert
              type="error"
              message={submitError}
              onClose={() => setSubmitError("")}
            />
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              label="Email Address"
              labelClass="text-blue-100"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              autoComplete="email"
              className="bg-blue-900/50 text-white border-blue-700 focus:border-yellow-300 focus:ring-yellow-300"
            />

            <Input
              id="password"
              type="password"
              label="Password"
              labelClass="text-blue-100"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
              autoComplete="current-password"
              className="bg-blue-900/50 text-white border-blue-700 focus:border-yellow-300 focus:ring-yellow-300"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-500 border-blue-700 rounded bg-blue-900/50"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-blue-200"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
              Start Your Journey
            </Button>
          </form>
        </div>
      </div>
    </DarkSkyBackground>
  );
};

export default Login;