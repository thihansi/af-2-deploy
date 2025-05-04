import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '../../assets/icons/star.png';
import airplaneIcon from '../../assets/icons/airplane.png';

const CountryCard = ({ country }) => (
  <Link 
    to={`/countries/${country.cca3}`}
    className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden 
              shadow-md transform transition duration-300 hover:scale-105 hover:rotate-1
              hover:shadow-xl border-4 border-white/20 hover:border-yellow-300/40 
              group relative"
  >
    {/* Star decoration in corner */}
    <div className="absolute -top-3 -right-3 z-10 transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity">
      <img src={starIcon} alt="Star" className="w-12 h-12 animate-pulse-slow" />
    </div>
    
    <div className="h-28 overflow-hidden bg-gray-100 relative">
      <img 
        src={country.flags.png} 
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/20 to-transparent"></div>
      
      {/* Airplane decoration on hover */}
      <div className="absolute top-4 left-0 transform -translate-x-full group-hover:translate-x-[500%] transition-all duration-1000">
        <img src={airplaneIcon} alt="Airplane" className="w-10 h-10" />
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="text-lg font-bold text-white mb-2 truncate">
        {country.name.common}
      </h3>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white text-xs font-medium px-3 py-1 bg-blue-500/70 rounded-full">
            {country.subregion || country.region}
          </p>
        </div>
        
        {country.capital && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 text-left">
            <p className="text-gray-300 text-xs font-medium leading-none mb-1">
              Capital:
            </p>
            <p className="text-yellow-100 text-xs font-bold">
              {country.capital[0]}
            </p>
          </div>
        )}
      </div>
      
      {/* Centered "Let's Visit!" button that appears on hover */}
      <div className="mt-3 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 text-sm font-bold py-2 px-6 rounded-full inline-flex items-center">
          Let's visit! 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  </Link>
);

export default CountryCard;