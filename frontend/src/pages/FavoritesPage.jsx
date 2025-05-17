import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SkyBackground from '../components/backgrounds/SkyBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import CountryCard from '../components/sections/CountryCard';
import { FaHeart, FaSadTear } from 'react-icons/fa';

const FavoritesPage = () => {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full country data for each favorite country code
  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (!favorites.length) {
        setFavoriteCountries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get full country data from REST Countries API
        const countriesResponse = await axios.get(
          `https://restcountries.com/v3.1/alpha?codes=${favorites.join(',')}`
        );
        
        setFavoriteCountries(countriesResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorite countries:', err);
        setError('Failed to load your favorite countries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!favoritesLoading) {
      fetchFavoriteCountries();
    }
  }, [favorites, favoritesLoading]);

  if (!isAuthenticated) {
    return (
      <SkyBackground>
        <Navbar />
        <div className="container mx-auto pt-24 px-4 sm:px-6 md:px-8 text-center">
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Login Required</h1>
            <p className="text-blue-100 mb-6">Please log in to see your favorite countries</p>
            <Link to="/login" className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 py-3 px-8 rounded-full font-bold">
              Log In Now
            </Link>
          </div>
        </div>
      </SkyBackground>
    );
  }

  return (
    <SkyBackground>
      <Navbar />
      <div className="container mx-auto pt-20 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FaHeart className="mr-3 text-red-400" /> 
              {user?.username}'s Favorite Countries
            </h1>
            <p className="text-blue-200 mt-2">
              Your personal collection of amazing places around the world!
            </p>
          </div>
          <Link to="/countries" className="mt-4 md:mt-0 bg-blue-500/50 hover:bg-blue-600/50 backdrop-blur-sm text-white py-2 px-6 rounded-full">
            Explore More Countries
          </Link>
        </div>

        {loading || favoritesLoading ? (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" />
            <p className="text-blue-200 mt-4">Finding your favorite destinations...</p>
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl text-center">
            <div className="text-6xl mb-6">😕</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-blue-200 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-block bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-8 rounded-full font-bold"
            >
              Try Again
            </button>
          </div>
        ) : favoriteCountries.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl text-center">
            <div className="text-6xl mb-6 flex justify-center">
              <FaSadTear className="text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
            <p className="text-blue-200 mb-6">
              You haven't added any countries to your favorites yet.
              Explore countries and click the heart icon to add them here!
            </p>
            <Link to="/countries" className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 py-3 px-8 rounded-full font-bold">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoriteCountries.map(country => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </div>
    </SkyBackground>
  );
};

export default FavoritesPage;