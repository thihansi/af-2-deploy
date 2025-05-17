import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaGlobeAmericas, FaUsers, FaSortAmountDown } from "react-icons/fa";

const CountryFilters = ({
  searchQuery,
  setSearchQuery,
  regionFilter,
  setRegionFilter,
  populationFilter,
  setPopulationFilter,
  sortOrder,
  setSortOrder,
}) => {
  // Track which filter is active for glow effect
  const [activeFilter, setActiveFilter] = useState(null);
  // Track if user is typing in search
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  
  // Handle focus events to show glow effect
  const handleFocus = (filterId) => {
    setActiveFilter(filterId);
    if (filterId === 'search') {
      setIsTyping(true);
    }
  };
  
  const handleBlur = (filterId) => {
    // For non-search filters, remove glow
    if (filterId !== 'search') {
      setTimeout(() => {
        if (activeFilter === filterId) {
          setActiveFilter(null);
        }
      }, 300);
    }
    // For search, we'll handle it differently to maintain glow while typing
  };

  // Track typing in search box
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to detect when typing stops
    typingTimeoutRef.current = setTimeout(() => {
      // Keep glow active as long as there's text in the search box
      if (!e.target.value) {
        setIsTyping(false);
        setActiveFilter(null);
      }
    }, 1500);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-blue-900/40 backdrop-blur-md rounded-3xl px-4 py-3 border-2 border-blue-600 shadow-lg relative overflow-hidden">
        {/* Space-themed decorative elements */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute top-0 right-10 w-4 h-4 rounded-full bg-yellow-200 opacity-70 animate-pulse"></div>
        <div className="absolute bottom-5 left-20 w-2 h-2 rounded-full bg-white opacity-50 animate-pulse-slow"></div>
        
        {/* Filter controls in a single row */}
        <div className="flex items-center space-x-3 justify-between">
          {/* Search input */}
          <div className={`relative transition-all duration-500 transform flex-grow ${(activeFilter === 'search' || isTyping) ? 'scale-[1.01]' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-yellow-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => handleFocus('search')}
              className={`py-2 block w-full pl-9 pr-3 text-sm bg-blue-800/50 border-2 
                         text-white rounded-full focus:outline-none transition-all duration-300
                         ${(activeFilter === 'search' || isTyping) 
                           ? 'border-yellow-300 shadow-[0_0_15px_rgba(252,211,77,0.6)]' 
                           : 'border-blue-500'}`}
              placeholder="Search..."
            />
          </div>

          {/* Region filter - Increased width */}
          <div className={`relative min-w-[150px] transition-all duration-500 transform ${activeFilter === 'region' ? 'scale-[1.02]' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaGlobeAmericas className="h-4 w-4 text-yellow-300" />
            </div>
            <select
              id="region-filter"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              onFocus={() => handleFocus('region')}
              onBlur={() => handleBlur('region')}
              className={`py-2 block w-full pl-7 pr-7 text-sm bg-blue-800/50 border-2 
                        text-white rounded-full appearance-none cursor-pointer transition-all duration-300
                        ${activeFilter === 'region' 
                          ? 'border-yellow-300 shadow-[0_0_15px_rgba(252,211,77,0.6)]' 
                          : 'border-blue-500'}`}
            >
              <option value="all">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-300">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>

          {/* Population filter */}
          <div className={`relative min-w-[120px] transition-all duration-500 transform ${activeFilter === 'population' ? 'scale-[1.02]' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaUsers className="h-4 w-4 text-yellow-300" />
            </div>
            <select
              id="population-filter"
              value={populationFilter}
              onChange={(e) => setPopulationFilter(e.target.value)}
              onFocus={() => handleFocus('population')}
              onBlur={() => handleBlur('population')}
              className={`py-2 block w-full pl-7 pr-7 text-sm bg-blue-800/50 border-2 
                        text-white rounded-full appearance-none cursor-pointer transition-all duration-300
                        ${activeFilter === 'population' 
                          ? 'border-yellow-300 shadow-[0_0_15px_rgba(252,211,77,0.6)]' 
                          : 'border-blue-500'}`}
            >
              <option value="all">Population</option>
              <option value="high">Giant (&gt;100M)</option>
              <option value="medium">Big (10M-100M)</option>
              <option value="low">Small (&lt;10M)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-300">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>

          {/* Sort order */}
          <div className={`relative min-w-[100px] transition-all duration-500 transform ${activeFilter === 'sort' ? 'scale-[1.02]' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaSortAmountDown className="h-4 w-4 text-yellow-300" />
            </div>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              onFocus={() => handleFocus('sort')}
              onBlur={() => handleBlur('sort')}
              className={`py-2 block w-full pl-7 pr-7 text-sm bg-blue-800/50 border-2 
                        text-white rounded-full appearance-none cursor-pointer transition-all duration-300
                        ${activeFilter === 'sort' 
                          ? 'border-yellow-300 shadow-[0_0_15px_rgba(252,211,77,0.6)]' 
                          : 'border-blue-500'}`}
            >
              <option value="name-asc">A to Z</option>
              <option value="name-desc">Z to A</option>
              <option value="population-high">Largest First</option>
              <option value="population-low">Smallest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-300">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        /* Ensure dropdown options look good */
        select option {
          background-color: #1e3a8a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CountryFilters;