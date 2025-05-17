import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const FavoriteButton = ({ 
  country, 
  size = 'md', 
  className = '',
  showLoginPrompt = true
}) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const navigate = useNavigate();
  
  const isCountryFavorite = country?.cca3 ? isFavorite(country.cca3) : false;
  
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated && showLoginPrompt) {
      navigate('/login?redirect=back&message=Please log in to add favorites');
      return;
    }
    
    if (country) {
      try {
        console.log('Trying to toggle favorite for:', country.name.common, '(', country.cca3, ')');
        await toggleFavorite(country);
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        toast.error('Could not update favorites. Please try again.');
      }
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };
  
  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${className}
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none
        ${isCountryFavorite
          ? 'bg-red-100/60 text-red-500 hover:bg-red-200/70 shadow-inner' 
          : 'bg-white/50 text-gray-400 hover:text-red-500 hover:bg-red-50/60'}
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
      `}
      aria-label={isCountryFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isCountryFavorite 
        ? <FaHeart className={loading ? "" : "animate-pulse"} /> 
        : <FaRegHeart />
      }
    </button>
  );
};

export default FavoriteButton;