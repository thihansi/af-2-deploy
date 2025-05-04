import React from 'react';
import { Link } from 'react-router-dom';
import CountryCard from './CountryCard';
import starIcon from '../../assets/icons/star.png';
import airplaneIcon from '../../assets/icons/airplane.png';

const CountriesSection = ({ 
  countries, 
  searchQuery, 
  loading, 
  error, 
  viewMoreCount, 
  handleViewMore 
}) => {
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 right-10 opacity-30">
        <img src={starIcon} alt="Star" className="w-16 h-16 animate-float-slow" />
      </div>
      <div className="absolute bottom-10 left-0 opacity-30">
        <img src={starIcon} alt="Star" className="w-20 h-20 animate-twinkle-slow" />
      </div>
      
      <div className="flex items-center mb-8">
        <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-900">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">
            {searchQuery ? 'Search Results' : 'Discover Countries'}
          </h2>
          <p className="text-blue-200 text-sm mt-1">
            {searchQuery 
              ? `Looking for countries with "${searchQuery}"`
              : "Explore amazing countries from around the world!"}
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-yellow-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={airplaneIcon} alt="Airplane" className="w-10 h-10" />
            </div>
          </div>
          <p className="mt-4 text-blue-200 text-lg animate-pulse">Flying around the world...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-4 border-red-400/20">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-red-300 text-lg mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-700 hover:to-blue-600 font-bold shadow-lg"
          >
            Let's Try Again!
          </button>
        </div>
      ) : (
        <>
          {filteredCountries.length === 0 ? (
            <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-2xl border-4 border-white/10">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-3">No countries found for "{searchQuery}"</h3>
              <p className="text-blue-200 text-lg mb-6">Try a different search word!</p>
              <Link to="/" className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 py-3 px-8 rounded-full font-bold inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go Back Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredCountries.slice(0, viewMoreCount).map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          )}
          
          {filteredCountries.length > viewMoreCount && !searchQuery && (
            <div className="text-center mt-12 mb-6 relative">
              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                <img src={airplaneIcon} alt="Airplane" className="w-12 h-12 animate-bounce-slow" />
              </div>
              
              <button 
                onClick={handleViewMore}
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 
                          text-blue-900 py-4 px-10 rounded-full font-bold text-lg
                          shadow-lg shadow-yellow-500/20 transform transition hover:scale-105 
                          flex mx-auto items-center border-2 border-yellow-200/50"
              >
                <span>Show Me More Countries!</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <p className="text-blue-200 mt-3 text-sm">
                {filteredCountries.length - viewMoreCount} more countries to discover!
              </p>
            </div>
          )}
          
          {/* Decorative cloud at bottom */}
          <div className="relative h-20 mt-16">
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
              <div className="cloud-shape bg-white/20 backdrop-blur-sm w-32 h-16 rounded-full"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountriesSection;