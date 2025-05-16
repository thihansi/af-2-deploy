import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaCompass } from 'react-icons/fa';

const RelatedCountries = ({ relatedCountries, region }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border-4 border-blue-400 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-400 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-cyan-400 rounded-full"></div>
      
      <h2 className="text-2xl font-bold mb-4 text-blue-800 relative z-10 flex items-center">
        <span className="mr-2">🧭</span> More Fun in {region}! <span className="ml-2">🗺️</span>
      </h2>
      
      <div className="divide-y-2 divide-blue-100 max-h-[400px] overflow-auto relative z-10 bg-white/80 rounded-xl border-2 border-blue-200 shadow-inner">
        {relatedCountries.map(country => (
          <Link 
            key={country.cca3}
            to={`/countries/${country.cca3}`}
            className="flex items-center p-3 hover:bg-white transition-all"
          >
            <div className="w-14 h-10 mr-3 rounded-lg shadow-md overflow-hidden border-2 border-white">
              <img 
                src={country.flags.svg} 
                alt={`Flag of ${country.name.common}`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-blue-800 font-bold hover:text-blue-600">{country.name.common}</span>
          </Link>
        ))}
      </div>
      
      {/* Adventure badge */}
      <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-md z-10 flex items-center">
        <FaCompass className="mr-1" /> New adventures!
      </div>
    </div>
  );
};

export default RelatedCountries;