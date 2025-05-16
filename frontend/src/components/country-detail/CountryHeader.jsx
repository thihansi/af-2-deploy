import React from 'react';

const CountryHeader = ({ country }) => {
  const { flags, name: countryName } = country;
  
  return (
    <div className="flex flex-wrap items-center mb-6 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
      <img 
        src={flags.svg} 
        alt={`Flag of ${countryName.common}`} 
        className="w-20 h-auto mr-5 rounded-xl shadow-md border-4 border-white" 
      />
      <div>
        <h1 className="text-4xl font-bold text-blue-900">{countryName.common}</h1>
        {countryName.official !== countryName.common && (
          <span className="inline-block bg-yellow-300/70 text-blue-800 text-sm px-3 py-1 rounded-full mt-2 font-medium">
            {countryName.official}
          </span>
        )}
      </div>
    </div>
  );
};

export default CountryHeader;