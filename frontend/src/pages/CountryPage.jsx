import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCountryByCode, fetchCountryByName, fetchRelatedCountries } from '../services/api';

const CountryPage = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [relatedCountries, setRelatedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try fetching by code first (if id is a code like "ALB")
        let data;
        if (id.length <= 3) {
          data = await fetchCountryByCode(id);
        } else {
          data = await fetchCountryByName(id);
        }
        
        setCountry(Array.isArray(data) ? data[0] : data);
        
        // Fetch related countries
        if (Array.isArray(data) && data[0]?.name?.common) {
          const related = await fetchRelatedCountries(data[0].name.common);
          setRelatedCountries(related);
        }
      } catch (err) {
        setError('Could not load country data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-6 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Oops!</h1>
        <p className="mb-6">{error || "Country not found"}</p>
        <Link to="/" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Navigation Bar */}
      <nav className="bg-blue-800/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">World Explorer</Link>
          <Link 
            to="/" 
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-1 px-4 rounded-full text-sm"
          >
            Back to Countries
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-4 md:p-6">
        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl">
          {/* Flag Header */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img 
              src={country.flags?.png || country.flags?.svg} 
              alt={country.flags?.alt || `Flag of ${country.name?.common}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{country.name?.common}</h1>
                <p className="text-white/80 text-lg">{country.name?.official}</p>
              </div>
            </div>
          </div>

          {/* Country Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h2 className="text-xl font-bold text-white border-b border-white/20 pb-2 mb-4">Basic Information</h2>
                <div className="space-y-3 text-white">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏙️</span>
                    <div>
                      <span className="font-medium text-white/70">Capital:</span>
                      <p>{country.capital?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🌎</span>
                    <div>
                      <span className="font-medium text-white/70">Region:</span>
                      <p>{country.region} {country.subregion ? `(${country.subregion})` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👨‍👩‍👧‍👦</span>
                    <div>
                      <span className="font-medium text-white/70">Population:</span>
                      <p>{country.population?.toLocaleString() || 'N/A'} people</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📏</span>
                    <div>
                      <span className="font-medium text-white/70">Area:</span>
                      <p>{country.area?.toLocaleString() || 'N/A'} km²</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages & Currency */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h2 className="text-xl font-bold text-white border-b border-white/20 pb-2 mb-4">Languages & Currency</h2>
                <div className="space-y-4 text-white">
                  <div>
                    <h3 className="font-medium text-white/70 mb-1">Languages:</h3>
                    {country.languages ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.values(country.languages).map((lang, idx) => (
                          <span key={idx} className="bg-blue-600/50 rounded-full px-3 py-1 text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : <p>No language data available</p>}
                  </div>
                  <div>
                    <h3 className="font-medium text-white/70 mb-1">Currencies:</h3>
                    {country.currencies ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(country.currencies).map(([code, currency]) => (
                          <span key={code} className="bg-green-600/50 rounded-full px-3 py-1 text-sm">
                            {currency.name} ({currency.symbol || code})
                          </span>
                        ))}
                      </div>
                    ) : <p>No currency data available</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Fun Facts & More */}
            <div className="space-y-6">
              {/* Fun Facts */}
              <div className="bg-yellow-100 rounded-xl p-5 border-2 border-yellow-300">
                <h2 className="text-xl font-bold text-blue-900 flex items-center">
                  <span className="text-2xl mr-2">✨</span> Fun Facts!
                </h2>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start">
                    <span className="text-xl mr-3 mt-0.5">🌟</span>
                    <p>
                      <strong>{country.name?.common}</strong> is located in <strong>{country.region}</strong>
                      {country.subregion && ` (${country.subregion})`}.
                    </p>
                  </li>
                  
                  {country.area && (
                    <li className="flex items-start">
                      <span className="text-xl mr-3 mt-0.5">📏</span>
                      <p>
                        This country has an area of <strong>{country.area.toLocaleString()} km²</strong> - 
                        {country.area > 1000000 ? ' that\'s huge!' : 
                         country.area > 500000 ? ' that\'s pretty big!' : 
                         country.area > 100000 ? ' that\'s medium-sized!' : 
                         country.area > 10000 ? ' that\'s kind of small!' : ' that\'s tiny!'}
                      </p>
                    </li>
                  )}
                  
                  {country.independent !== undefined && (
                    <li className="flex items-start">
                      <span className="text-xl mr-3 mt-0.5">{country.independent ? '🎉' : '🤝'}</span>
                      <p>
                        {country.independent 
                          ? `${country.name?.common} is an independent country.` 
                          : `${country.name?.common} is a territory or dependent area.`}
                      </p>
                    </li>
                  )}
                  
                  {country.unMember !== undefined && country.unMember && (
                    <li className="flex items-start">
                      <span className="text-xl mr-3 mt-0.5">🇺🇳</span>
                      <p>This country is a member of the United Nations!</p>
                    </li>
                  )}

                  {country.borders && country.borders.length === 0 && (
                    <li className="flex items-start">
                      <span className="text-xl mr-3 mt-0.5">🏝️</span>
                      <p>This is an island country with no land borders!</p>
                    </li>
                  )}
                </ul>
              </div>

              {/* Neighboring Countries */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h2 className="text-xl font-bold text-white border-b border-white/20 pb-2 mb-4">
                  Neighboring Countries
                </h2>
                {country.borders && country.borders.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {country.borders.map(border => (
                      <Link 
                        key={border} 
                        to={`/countries/${border}`}
                        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-white">This country has no land borders.</p>
                )}
              </div>

              {/* Hello in Local Language */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <div className="relative">
                  <div className="absolute -top-4 -right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-lg">👋</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3">Say Hello!</h2>
                  
                  {country.languages ? (
                    <div className="space-y-2">
                      {Object.entries(country.languages).map(([code, language]) => {
                        // Simple mapping of common greetings - we're not using an API here to keep it simple
                        const greetings = {
                          eng: "Hello!",
                          spa: "¡Hola!",
                          fra: "Bonjour!",
                          deu: "Hallo!",
                          ita: "Ciao!",
                          por: "Olá!",
                          rus: "Привет!",
                          jpn: "こんにちは!",
                          kor: "안녕하세요!",
                          zho: "你好!",
                          ara: "مرحبا!",
                          hin: "नमस्ते!",
                          sqi: "Përshëndetje!"
                        };

                        return (
                          <div key={code} className="text-white">
                            <span className="text-white/70 mr-2">{language}:</span>
                            <span className="text-xl font-medium">{greetings[code] || "Hello!"}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-white">No language data available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Countries */}
          {relatedCountries.length > 0 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Explore More Countries</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {relatedCountries.map((country) => (
                  <Link 
                    key={country.cca3}
                    to={`/countries/${country.cca3}`}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 transition-all hover:transform hover:scale-105"
                  >
                    <div className="aspect-video mb-2 overflow-hidden rounded-lg">
                      <img 
                        src={country.flags?.png || country.flags?.svg} 
                        alt={`Flag of ${country.name.common}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-white font-medium text-center truncate">{country.name.common}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryPage;