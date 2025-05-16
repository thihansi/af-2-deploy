import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchCountryByCode,
  fetchCountryByName,
  fetchRelatedCountries,
} from "../services/countriesService";
import {
  FaArrowLeft,
  FaGlobe,
  FaMapMarkedAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import SkyBackground from "../components/backgrounds/SkyBackground";
import CountryInfo from "../components/country-detail/CountryInfo";
import BorderingCountries from "../components/country-detail/BorderingCountries";
import RelatedCountries from "../components/country-detail/RelatedCountries";
import FunFactsQuiz from "../components/country-detail/FunFactsQuiz";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

const CountryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [relatedCountries, setRelatedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to fetch by code (assuming id might be a country code)
        try {
          const countryData = await fetchCountryByCode(id);
          setCountry(countryData[0]);

          // If successful, fetch related countries
          const related = await fetchRelatedCountries(
            countryData[0].name.common
          );
          setRelatedCountries(related);
        } catch (codeError) {
          // If fetching by code fails, try by name
          try {
            const countryData = await fetchCountryByName(id);
            setCountry(countryData[0]);

            // If successful, fetch related countries
            const related = await fetchRelatedCountries(id);
            setRelatedCountries(related);
          } catch (nameError) {
            throw new Error(
              `Country "${id}" not found. Please check the ID or name and try again.`
            );
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <SkyBackground>
        <Navbar />
        <div className="container mx-auto pt-24 px-4 sm:px-6 md:px-8 text-center">
          <FaGlobe className="text-6xl text-blue-300 mx-auto animate-bounce mb-4" />
          <LoadingSpinner message="Exploring the amazing world..." />
          <p className="text-white mt-2">Get ready for a fun adventure!</p>
        </div>
      </SkyBackground>
    );
  }

  if (error) {
    return (
      <SkyBackground>
        <Navbar />
        <ErrorDisplay
          title="Oops! Country not found"
          message={error}
          linkTo="/"
          linkText="Let's go back home"
        />
      </SkyBackground>
    );
  }

  if (!country) return null;

  return (
    <SkyBackground>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 md:pt-24 md:pb-16">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-full transition transform hover:scale-105 flex items-center shadow-md"
          >
            <FaArrowLeft className="mr-2" /> Go back
          </button>
        </div>
              
        {/* Country Header */}
        <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-lg mb-6 flex flex-col sm:flex-row items-center border-2 border-blue-300/50">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <img
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
              className="w-32 h-auto rounded-xl shadow-lg border-4 border-white/80"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
              {country.name.common}
            </h1>
            {country.name.official !== country.name.common && (
              <span className="inline-block bg-yellow-300 text-blue-900 font-bold text-sm px-4 py-1 rounded-full mt-2 shadow-sm">
                {country.name.official}
              </span>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main content column */}
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            {/* Country Info */}
            <CountryInfo country={country} />
            
            {/* Fun Facts Quiz */}
            <FunFactsQuiz country={country} />
            
            {/* Bordering Countries (shown below on larger screens) */}
            <div className="block xl:hidden">
              {country.borders && country.borders.length > 0 && (
                <div className="mt-6">
                  <BorderingCountries borders={country.borders} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar column */}
          <div className="xl:col-span-1 space-y-6">
            {/* Related Countries */}
            <RelatedCountries
              relatedCountries={relatedCountries}
              region={country.region}
            />
            
            {/* Bordering Countries (shown in sidebar on extra-large screens) */}
            <div className="hidden xl:block">
              {country.borders && country.borders.length > 0 && (
                <BorderingCountries borders={country.borders} />
              )}
            </div>
            
            {/* Additional map link for mobile views */}
            <div className="block xl:hidden bg-gradient-to-r from-blue-500/30 to-teal-500/30 backdrop-blur-sm p-4 rounded-2xl text-center shadow-lg border-2 border-blue-200/50">
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md flex items-center justify-center">
                <FaMapMarkedAlt className="mr-2 text-yellow-300" /> Explore {country.name.common}
              </h3>
              <a
                href={country.maps?.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition transform hover:scale-105 shadow-md"
              >
                Open Map
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with kid-friendly note */}
      <div className="container mx-auto px-4 pb-8 text-center">
        <p className="text-white/70 text-sm">
          Keep exploring to learn more about our amazing world! 🌍
        </p>
      </div>
    </SkyBackground>
  );
};

export default CountryPage;