import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';
import DarkSkyBackground from "../components/backgrounds/DarkSkyBackground";
import Navbar from "../components/Navbar";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear errors when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Redirect to home page on successful registration
    } catch (error) {
      setSubmitError(error.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <DarkSkyBackground>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-blue-950/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-400/20">
          <div>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
              Join The Adventure!
            </h2>
            <p className="mt-2 text-center text-sm text-blue-200">
              Or{' '}
              <Link to="/login" className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors duration-300">
                continue your journey with an existing account
              </Link>
            </p>
          </div>
          
          {submitError && <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />}
          
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Input
              id="username"
              type="text"
              label="Explorer Name"
              labelClass="text-blue-100"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              required
              autoComplete="username"
              className="bg-blue-900/50 text-white border-blue-700 focus:border-yellow-300 focus:ring-yellow-300"
            />
            
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
              autoComplete="new-password"
              className="bg-blue-900/50 text-white border-blue-700 focus:border-yellow-300 focus:ring-yellow-300"
            />
            
            {formData.password && (
              <div className="pt-1">
                <PasswordStrengthIndicator password={formData.password} />
              </div>
            )}
            
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              labelClass="text-blue-100"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
              autoComplete="new-password"
              className="bg-blue-900/50 text-white border-blue-700 focus:border-yellow-300 focus:ring-yellow-300"
            />

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
              Begin Your Adventure
            </Button>
          </form>
        </div>
      </div>
    </DarkSkyBackground>
  );
};

export default Signup;