import React from 'react';
import { FaGlobe, FaUsers, FaLanguage, FaMoneyBillWave, FaMapMarkerAlt, FaMountain } from 'react-icons/fa';

const CountryInfo = ({ country }) => {
  const {
    flags,
    capital,
    region,
    subregion,
    population,
    languages,
    currencies,
    maps,
    coatOfArms,
  } = country;

  const infoItems = [
    {
      icon: <FaMapMarkerAlt className="text-2xl text-red-500" />,
      label: 'Capital City',
      value: capital ? capital.join(', ') : 'N/A',
      color: 'bg-red-100',
      border: 'border-red-200'
    },
    {
      icon: <FaGlobe className="text-2xl text-blue-500" />,
      label: 'World Region',
      value: `${region} ${subregion ? `(${subregion})` : ''}`,
      color: 'bg-blue-100',
      border: 'border-blue-200'
    },
    {
      icon: <FaUsers className="text-2xl text-green-500" />,
      label: 'Population',
      value: new Intl.NumberFormat().format(population),
      color: 'bg-green-100',
      border: 'border-green-200'
    },
    {
      icon: <FaLanguage className="text-2xl text-purple-500" />,
      label: 'Languages',
      value: languages ? Object.values(languages).join(', ') : 'N/A',
      color: 'bg-purple-100',
      border: 'border-purple-200'
    },
    {
      icon: <FaMoneyBillWave className="text-2xl text-yellow-500" />,
      label: 'Money Used',
      value: currencies 
        ? Object.values(currencies).map(currency => 
            `${currency.name} (${currency.symbol})`
          ).join(', ')
        : 'N/A',
      color: 'bg-yellow-100',
      border: 'border-yellow-200'
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border-4 border-green-400 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-400 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-teal-400 rounded-full"></div>
      
      <h2 className="text-2xl font-bold mb-4 text-green-800 relative z-10 flex items-center">
        <span className="mr-2">📝</span> All About {country.name.common}! <span className="ml-2">🔍</span>
      </h2>
      
      {/* Flag and Coat of Arms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/80 rounded-2xl mb-4 border-2 border-green-200 shadow-md relative z-10">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-1">🏁</span> National Flag
          </h3>
          <div className="bg-white p-3 rounded-xl shadow-md border-2 border-green-100 w-full">
            <img 
              src={flags.svg} 
              alt={`Flag of ${country.name.common}`} 
              className="w-full max-h-32 object-contain rounded" 
            />
          </div>
        </div>
        
        {coatOfArms.svg && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
              <span className="mr-1">🛡️</span> Coat of Arms
            </h3>
            <div className="bg-white p-3 rounded-xl shadow-md border-2 border-green-100 w-full">
              <img 
                src={coatOfArms.svg} 
                alt={`Coat of Arms of ${country.name.common}`} 
                className="max-h-32 object-contain mx-auto" 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Country Information */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {infoItems.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 ${item.color} rounded-xl flex items-center border-2 ${item.border} hover:scale-[1.02] transition-transform`}
            >
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-white rounded-full mr-3 shadow-sm">
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-gray-700">{item.label}</div>
                <div className="text-gray-700">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Map Link */}
        {maps && maps.googleMaps && (
          <div className="mt-4 text-center">
            <a 
              href={maps.googleMaps} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
            >
              <FaGlobe className="mr-2" /> See on Google Maps!
            </a>
          </div>
        )}
      </div>
      
      {/* Explorer badge */}
      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-md z-10 flex items-center">
        <FaMountain className="mr-1" /> Explorer info!
      </div>
    </div>
  );
};

export default CountryInfo;