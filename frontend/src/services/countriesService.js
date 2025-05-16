import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1';

export const fetchAllCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching countries: ' + error.message);
  }
};

export const fetchCountryByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching country: ' + error.message);
  }
};

export const fetchCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/alpha/${code}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching country by code: ' + error.message);
  }
};

export const fetchRelatedCountries = async (countryName) => {
  try {
    // First get the country's region to find related countries
    const countryResponse = await axios.get(`${API_URL}/name/${countryName}?fullText=true`);
    const country = countryResponse.data[0];
    
    // Get countries in the same region
    const regionResponse = await axios.get(`${API_URL}/region/${country.region}`);
    
    // Filter out the original country and limit to 5 related countries
    const relatedCountries = regionResponse.data
      .filter(c => c.name.common !== countryName)
      .slice(0, 5);
      
    return relatedCountries;
  } catch (error) {
    throw new Error('Error fetching related countries: ' + error.message);
  }
};