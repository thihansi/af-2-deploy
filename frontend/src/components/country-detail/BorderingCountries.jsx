import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCountryByCode } from '../../services/countriesService';
import { FaGlobeAmericas, FaPlane } from 'react-icons/fa';

const BorderingCountries = ({ borders }) => {
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorderingCountries = async () => {
      try {
        const countries = await Promise.all(
          borders.map(async (code) => {
            const response = await fetchCountryByCode(code);
            return response[0];
          })
        );
        setBorderCountries(countries);
      } catch (error) {
        console.error("Error fetching bordering countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorderingCountries();
  }, [borders]);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border-4 border-purple-400 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-400 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-400 rounded-full"></div>
      
      <h2 className="text-2xl font-bold mb-4 text-purple-800 relative z-10 flex items-center">
        <span className="mr-2">🌎</span> Friendly Neighbors <span className="ml-2">🌍</span>
      </h2>
      
      <div className="relative z-10">
        {loading ? (
          <div className="text-center py-8 bg-white/80 rounded-xl">
            <div className="inline-block animate-bounce mb-2 text-4xl">🧭</div>
            <div className="font-bold text-purple-700">Finding the neighbors...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {borderCountries.map(country => (
              <Link 
                key={country.cca3}
                to={`/countries/${country.cca3}`}
                className="bg-white/80 hover:bg-white border-3 border-purple-200 rounded-xl p-3 text-center transition-all hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-12 mb-2 rounded-lg overflow-hidden border-3 border-white shadow-sm">
                    <img 
                      src={country.flags.svg} 
                      alt={`Flag of ${country.name.common}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-purple-800 font-bold text-sm">{country.name.common}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Visit badge */}
      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-md z-10 flex items-center">
        <FaPlane className="mr-1" /> Let's visit!
      </div>
    </div>
  );
};

export default BorderingCountries;