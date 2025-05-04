import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryMap from './CountryMap';
import CountryStats from './CountryStats';
import RelatedCountries from './RelatedCountries';
import Navbar from '../Navbar';
import SkyBackground from '../backgrounds/SkyBackground';
import { Link } from 'react-router-dom';
import airplaneIcon from '../../assets/icons/airplane.png';

const CountryDetail = ({ country }) => {
  if (!country) {
    return <div>No country data found.</div>;
  }

  // The REST Countries API returns country as an array with one item
  const countryData = Array.isArray(country) ? country[0] : country;

  return (
    <SkyBackground>
      <Navbar />
      <div className="min-h-screen w-full pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <Link 
          to="/" 
          className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-yellow-300 font-bold py-2 px-5 rounded-full transition-colors shadow-md mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Countries
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Flag and basic info */}
            <div className="md:w-1/3">
              <div className="bg-white p-2 rounded-lg shadow-lg mb-6">
                <img 
                  src={countryData.flags?.png || countryData.flags?.svg} 
                  alt={countryData.flags?.alt || `Flag of ${countryData.name?.common}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="bg-white/90 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-blue-900 mb-2">{countryData.name?.common}</h1>
                <p className="text-blue-800 mb-4 text-lg">{countryData.name?.official}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-bold">Capital:</span> {countryData.capital ? countryData.capital.join(', ') : 'N/A'}
                  </div>
                  <div>
                    <span className="font-bold">Region:</span> {countryData.region || 'N/A'}
                    {countryData.subregion && ` (${countryData.subregion})`}
                  </div>
                  <div>
                    <span className="font-bold">Population:</span> {countryData.population?.toLocaleString() || 'N/A'}
                  </div>
                  <div>
                    <span className="font-bold">Area:</span> {countryData.area?.toLocaleString() || 'N/A'} km²
                  </div>
                  
                  {/* Add a kid saying hello in local language */}
                  <GreetingSection country={countryData} />
                </div>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="md:w-2/3 space-y-6">
              <div className="bg-white/90 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Country Info</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Languages</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {countryData.languages ? 
                        Object.values(countryData.languages).map((language, index) => (
                          <li key={index}>{language}</li>
                        )) : 
                        <li>No language data available</li>
                      }
                    </ul>
                  </div>
                  
                  {/* Currencies */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Currencies</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {countryData.currencies ? 
                        Object.entries(countryData.currencies).map(([code, currency]) => (
                          <li key={code}>
                            {currency.name} ({currency.symbol || code})
                          </li>
                        )) : 
                        <li>No currency data available</li>
                      }
                    </ul>
                  </div>
                  
                  {/* Timezone */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Timezones</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {countryData.timezones ? 
                        countryData.timezones.map((timezone, index) => (
                          <li key={index}>{timezone}</li>
                        )) : 
                        <li>No timezone data available</li>
                      }
                    </ul>
                  </div>
                  
                  {/* Borders */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Neighboring Countries</h3>
                    {countryData.borders && countryData.borders.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {countryData.borders.map(border => (
                          <Link 
                            key={border} 
                            to={`/countries/${border}`}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm"
                          >
                            {border}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>Island country (no land borders)</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Fun Facts for Kids */}
              <div className="bg-yellow-100 p-6 rounded-lg shadow-lg border-2 border-yellow-300">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">✨</span>
                  <h2 className="text-2xl font-bold text-blue-900">Fun Facts!</h2>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex">
                    <span className="text-xl mr-2">🌎</span>
                    <span>
                      <strong>{countryData.name?.common}</strong> is located in <strong>{countryData.region}</strong>
                      {countryData.subregion && ` (${countryData.subregion})`}.
                    </span>
                  </li>
                  
                  {countryData.capital && (
                    <li className="flex">
                      <span className="text-xl mr-2">🏙️</span>
                      <span>The capital city is <strong>{countryData.capital.join(', ')}</strong>.</span>
                    </li>
                  )}
                  
                  {countryData.area && (
                    <li className="flex">
                      <span className="text-xl mr-2">📏</span>
                      <span>
                        This country has an area of <strong>{countryData.area.toLocaleString()} km²</strong> - 
                        {countryData.area > 1000000 ? ' that\'s huge!' : 
                         countryData.area > 500000 ? ' that\'s pretty big!' : 
                         countryData.area > 100000 ? ' that\'s medium-sized!' : 
                         countryData.area > 10000 ? ' that\'s kind of small!' : ' that\'s tiny!'}
                      </span>
                    </li>
                  )}
                  
                  {countryData.independent !== undefined && (
                    <li className="flex">
                      <span className="text-xl mr-2">{countryData.independent ? '🎉' : '🤝'}</span>
                      <span>
                        {countryData.independent 
                          ? `${countryData.name?.common} is an independent country.` 
                          : `${countryData.name?.common} is a territory or dependent area.`}
                      </span>
                    </li>
                  )}
                  
                  {countryData.unMember !== undefined && countryData.unMember && (
                    <li className="flex">
                      <span className="text-xl mr-2">🇺🇳</span>
                      <span>This country is a member of the United Nations!</span>
                    </li>
                  )}
                </ul>
                
                {/* Decorate with an airplane */}
                <div className="relative h-16 mt-6">
                  <div className="absolute right-0 bottom-0 transform translate-y-1/2">
                    <img src={airplaneIcon} alt="Airplane" className="h-12 w-12 animate-float" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Countries Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Explore Related Countries</h2>
            
            <div className="bg-white/90 p-6 rounded-lg shadow-lg">
              {countryData.name && <RelatedCountries countryName={countryData.name.common} />}
            </div>
          </div>
        </div>
      </div>
    </SkyBackground>
  );
};

const GreetingSection = ({ country }) => {
  const [greeting, setGreeting] = useState("Hello!");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGreeting = async () => {
      if (!country.languages) {
        setLoading(false);
        return;
      }

      try {
        // Get the primary language code (first one in the object)
        const languageCode = Object.keys(country.languages)[0];
        
        // Using LibreTranslate API (or you could use Google Translate API with an API key)
        const response = await axios.post('https://libretranslate.de/translate', {
          q: 'Hello',
          source: 'en',
          target: languageCode
        });
        
        if (response.data && response.data.translatedText) {
          setGreeting(response.data.translatedText);
        }
      } catch (error) {
        console.log('Translation error:', error);
        // Fallback to default
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, [country]);

  return (
    <div className="relative mt-6 p-4 bg-yellow-100 rounded-xl border-2 border-yellow-300">
      <div className="absolute -top-6 -right-2">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-xl">👋</span>
        </div>
      </div>
      <p className="text-blue-900 font-bold">Hello in {country.name?.common}:</p>
      <p className="text-blue-800 text-xl mt-1">
        {loading ? <span className="text-gray-500">Loading...</span> : greeting}
      </p>
    </div>
  );
};

export default CountryDetail;