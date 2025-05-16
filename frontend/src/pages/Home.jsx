import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SkyBackground from "../components/backgrounds/SkyBackground";
import globeImage from "../assets/images/globe.png";
import CountriesSection from "../components/sections/CountriesSection";
import ContinentsSection from "../components/sections/ContinentsSection";
import CountryFilters from "../components/sections/CountryFilters"; // Add this import

const Home = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMoreCount, setViewMoreCount] = useState(20);
  const [regionFilter, setRegionFilter] = useState("all");
  const [populationFilter, setPopulationFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name-asc");

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3,region,population,capital"
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Sort countries by name initially
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries. Please try again later.");
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Group countries by continent for the explore section
  const continents = {
    Africa: countries
      .filter((country) => country.region === "Africa")
      .slice(0, 4),
    Americas: [
      ...countries.filter((country) => country.region === "Americas"),
    ].slice(0, 4),
    Asia: countries.filter((country) => country.region === "Asia").slice(0, 4),
    Europe: countries
      .filter((country) => country.region === "Europe")
      .slice(0, 4),
    Oceania: countries
      .filter((country) => country.region === "Oceania")
      .slice(0, 4),
  };

  const handleViewMore = () => {
    setViewMoreCount((prev) => prev + 20);
  };

  const getFilteredCountries = () => {
    let filtered = [...countries];

    // Apply region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((country) => country.region === regionFilter);
    }

    // Apply population filter
    if (populationFilter === "high") {
      filtered = filtered.filter((country) => country.population > 100000000);
    } else if (populationFilter === "medium") {
      filtered = filtered.filter(
        (country) =>
          country.population > 10000000 && country.population <= 100000000
      );
    } else if (populationFilter === "low") {
      filtered = filtered.filter((country) => country.population <= 10000000);
    }

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOrder === "name-asc") {
      filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortOrder === "name-desc") {
      filtered.sort((a, b) => b.name.common.localeCompare(a.name.common));
    } else if (sortOrder === "population-high") {
      filtered.sort((a, b) => b.population - a.population);
    } else if (sortOrder === "population-low") {
      filtered.sort((a, b) => a.population - b.population);
    }

    return filtered;
  };

  return (
    <SkyBackground>
      <div className="min-h-screen w-full overflow-auto pt-16 md:pt-20">
        <Navbar />

        {/* Hero section */}
        <div className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between">
            <div className="max-w-2xl lg:mr-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                {isAuthenticated && !authLoading
                  ? `Welcome back, ${user.username}!`
                  : "Hello, Young Explorer!"}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {isAuthenticated && !authLoading
                  ? "Continue your journey through the world's countries and cultures!"
                  : "Welcome to Globe Explorer! Your adventure through the world's countries and cultures starts here."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/explore"
                  className="px-8 py-3 text-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-lg shadow-lg transform transition hover:scale-105"
                >
                  Explore 3D Globe
                </Link>
                <Link
                  to="/quiz"
                  className="px-8 py-3 text-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transform transition hover:scale-105"
                >
                  Start Quiz
                </Link>
              </div>
            </div>

            {/* Globe image */}
            <div className="mt-10 lg:mt-0">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl"></div>
                <img
                  src={
                    globeImage ||
                    "https://cdn.pixabay.com/photo/2021/01/17/12/13/earth-5924864_1280.png"
                  }
                  alt="Earth"
                  className="relative z-10 w-full h-full object-contain animate-float-slow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search section */}
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          

          {/* New filter controls */}
          <CountryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          populationFilter={populationFilter}
          setPopulationFilter={setPopulationFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        </div>

        {/* Countries grid section */}
        <CountriesSection
          countries={getFilteredCountries()}
          searchQuery=""
          loading={loading}
          error={error}
          viewMoreCount={viewMoreCount}
          handleViewMore={handleViewMore}
        />

        {/* Continents section - only if countries are loaded */}
        {!loading && countries.length > 0 && (
          <ContinentsSection continents={continents} loading={loading} />
        )}

        {/* Facts ticker */}
        <div className="relative py-4 bg-white/5 backdrop-blur-sm overflow-hidden mt-8">
          <div className="whitespace-nowrap animate-marquee inline-block">
            {Array(2)
              .fill(
                [
                  "The Nile River is the longest river in the world! ★ ",
                  "China has the largest population in the world! ★ ",
                  "Russia is the largest country by land area! ★ ",
                  "Vatican City is the smallest country in the world! ★ ",
                  "Antarctica is the coldest continent! ★ ",
                  "The Great Barrier Reef is the largest living structure on Earth! ★ ",
                  "Mount Everest is the highest mountain above sea level! ★ ",
                ].join("")
              )
              .map((text, i) => (
                <span key={i} className="text-yellow-300 font-medium mx-2">
                  {text}
                </span>
              ))}
          </div>
        </div>

        {/* Quiz CTA */}
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 md:p-10 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ready for a quiz challenge?
                </h2>
                <p className="mt-2 text-blue-100">
                  Test your knowledge about countries and win fun badges!
                </p>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                           rounded-full shadow text-base font-bold text-blue-900 bg-yellow-400 
                           hover:bg-yellow-500 transition-colors duration-300"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkyBackground>
  );
};

export default Home;
