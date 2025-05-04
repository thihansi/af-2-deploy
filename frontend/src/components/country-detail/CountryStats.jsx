import React from 'react';

const CountryStats = ({ country }) => {
  if (!country) return null;

  const { gdp, literacyRate, population, area } = country;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Country Statistics</h2>
      <ul className="list-disc pl-5">
        <li><strong>Population:</strong> {population.toLocaleString()}</li>
        <li><strong>Area:</strong> {area.toLocaleString()} km²</li>
        <li><strong>GDP:</strong> ${gdp.toLocaleString()} billion</li>
        <li><strong>Literacy Rate:</strong> {literacyRate}%</li>
      </ul>
    </div>
  );
};

export default CountryStats;