import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SkyBackground from "../components/backgrounds/SkyBackground";
import CountryCard from "../components/sections/CountryCard";
import starIcon from "../assets/icons/star.png";
import airplaneIcon from "../assets/icons/airplane.png";
import shootingStarIcon from "../assets/icons/shooting-star.png";
import hotAirBalloon from "../assets/icons/hot-air-balloon.png";
import rainbow from "../assets/icons/rainbow.png";

const ContinentPage = () => {
  const { continentName } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Continent data for header
  const continentData = {
    africa: {
      name: "Africa",
      description:
        "Africa is the world's second-largest and second-most populous continent. It's known for its diverse wildlife, breathtaking landscapes, and rich cultural heritage.",
      color: "from-yellow-600 to-orange-600",
      emoji: "🦁",
      image:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      funFact: "Africa has the world's largest desert - the Sahara!",
    },
    americas: {
      name: "Americas",
      description:
        "The Americas comprise North, Central, and South America, along with the Caribbean islands. This diverse continent spans from the Arctic to Antarctica.",
      color: "from-green-600 to-blue-600",
      emoji: "🦅",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      funFact:
        "The Americas have the world's longest mountain range - the Andes!",
    },
    asia: {
      name: "Asia",
      description:
        "Asia is Earth's largest and most populous continent, home to Mount Everest, the Himalayas, and dozens of diverse cultures and civilizations.",
      color: "from-red-600 to-amber-600",
      emoji: "🐯",
      image:
        "https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      funFact: "Asia has the tallest mountain in the world - Mount Everest!",
    },
    europe: {
      name: "Europe",
      description:
        "Europe is a continent with a rich history, beautiful architecture, and diverse cultures. Despite being one of the smallest continents, it has many countries.",
      color: "from-blue-600 to-purple-600",
      emoji: "🏰",
      image:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      funFact:
        "Europe has more countries close together than any other continent!",
    },
    oceania: {
      name: "Oceania",
      description:
        "Oceania is a geographic region that includes Australasia, Melanesia, Micronesia, and Polynesia. It's surrounded by the Pacific Ocean and known for its islands.",
      color: "from-blue-400 to-teal-600",
      emoji: "🏝️",
      image:
        "https://images.unsplash.com/photo-1589330273594-fade1ee91647?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      funFact:
        "Oceania has the Great Barrier Reef, the largest coral reef in the world!",
    },
    antarctic: {
      name: "Antarctic",
      description: "A frozen wonderland with penguins and beautiful icebergs!",
      color: "from-blue-300 to-blue-600",
      emoji: "🐧",
      image:
        "https://images.unsplash.com/photo-1687904477461-3b38aeef9e54?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      funFact:
        "Antarctica is the coldest, windiest and driest continent on Earth!",
    },
  };

  const currentContinent = continentData[continentName.toLowerCase()] || {
    name: continentName,
    description: `Explore countries in ${continentName}`,
    color: "from-blue-600 to-purple-600",
    emoji: "🌍",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    funFact: "There are 7 continents on Earth!",
  };

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3,region,subregion,population,capital"
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        // Filter countries by continent/region
        let filteredCountries = [];

        if (continentName.toLowerCase() === "americas") {
          filteredCountries = data.filter(
            (country) =>
              country.region === "Americas" ||
              country.subregion?.includes("America")
          );
        } else {
          filteredCountries = data.filter(
            (country) =>
              country.region.toLowerCase() === continentName.toLowerCase()
          );
        }

        // Sort countries by name
        const sortedCountries = filteredCountries.sort((a, b) =>
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
  }, [continentName]);

  return (
    <SkyBackground>
      <div className="min-h-screen w-full overflow-auto">
        <Navbar />

        {/* Continent header with image - enhanced for kids */}
        <div className="relative h-80 md:h-96 mb-8 pt-20">
          {/* Header background image */}
          <div className="absolute inset-0">
            <img
              src={currentContinent.image}
              alt={`${currentContinent.name} continent`}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-b ${currentContinent.color} opacity-70`}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/30 to-transparent"></div>
          </div>

          {/* Decorative elements - adjusted positioning */}
          <div className="absolute top-24 left-10 animate-float-slow">
            <img src={starIcon} alt="Star" className="w-16 h-16" />
          </div>
          <div className="absolute bottom-20 right-10 animate-bounce-slow">
            <img src={airplaneIcon} alt="Airplane" className="w-14 h-14" />
          </div>

          {/* Header content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <div className="flex items-center mb-3">
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full text-4xl mr-5 shadow-lg transform transition-transform hover:rotate-12">
                {currentContinent.emoji}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                {currentContinent.name}
              </h1>
            </div>
            <p className="text-white/90 max-w-2xl text-sm sm:text-base md:text-lg backdrop-blur-sm bg-white/10 p-4 rounded-xl border border-white/20">
              {currentContinent.description}
            </p>

            {/* Fun fact badge - adjusted positioning */}
            <div className="absolute top-28 right-8 max-w-xs">
              <div className="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 text-blue-900 px-4 py-3 rounded-2xl text-sm font-bold shadow-lg border-4 border-white/30 transform rotate-2">
                <div className="flex items-center mb-1">
                  <div className="text-lg mr-1">💡</div>
                  <span className="uppercase tracking-wide text-xs">
                    Fun Fact!
                  </span>
                </div>
                {currentContinent.funFact}
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            to="/"
            className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-yellow-300 font-bold py-2 px-5 rounded-full transition-colors shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Countries grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 right-10 opacity-30 z-10">
            <img
              src={starIcon}
              alt="Star"
              className="w-16 h-16 animate-float-slow"
            />
          </div>
          <div className="absolute bottom-10 left-0 opacity-30 z-10">
            <img
              src={shootingStarIcon}
              alt="Star"
              className="w-20 h-20 animate-twinkle-slow"
            />
          </div>

          <div className="flex items-center mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Countries in {currentContinent.name}
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                {countries.length > 0
                  ? `Discover ${countries.length} amazing countries!`
                  : "Loading countries..."}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-pulse">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-white/10 backdrop-blur-sm rounded-2xl border-4 border-white/10"
                ></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-4 border-red-400/20">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-300 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-700 hover:to-blue-600 font-bold shadow-lg"
              >
                Let's Try Again!
              </button>
            </div>
          ) : countries.length === 0 ? (
            <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-2xl border-4 border-white/10">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 animate-spin-slow">
                  <img src={starIcon} alt="Star" className="w-full h-full" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  🔍
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 mt-4">
                No countries found for {currentContinent.name}
              </h3>
              <p className="text-blue-200 text-lg mb-6">
                Try exploring another continent!
              </p>
              <Link
                to="/"
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 py-3 px-8 rounded-full font-bold inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Go Back Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {countries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          )}

          {/* Decorative elements at bottom */}
          <div className="relative h-32 mt-16">
            {/* Animated cloud */}
            <div className="absolute left-20 -top-6 transform -translate-x-1/2 animate-float-slow">
              <div className="cloud-shape bg-white/30 backdrop-blur-sm w-24 h-12 rounded-full"></div>
            </div>

            {/* Animated sparkle */}
            <div className="absolute left-1/4 -top-6 transform -translate-x-1/2 rotate-12">
              <img
                src={starIcon}
                alt="Sparkle"
                className="w-16 h-16 animate-bounce-slow"
              />
            </div>

            {/* Animated star */}
            <div className="absolute right-1/4 -top-10 transform translate-x-1/2 -rotate-12">
              <img
                src={shootingStarIcon}
                alt="Sparkle"
                className="w-16 h-16 animate-bounce-slow"
              />
            </div>

            {/* Rainbow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <img
                src={rainbow}
                alt="Rainbow"
                className="w-32 h-16 animate-float-slow"
              />
            </div>

            {/* Hot air balloon */}
            <div className="absolute right-10 top-0 transform -translate-y-1/2 animate-float">
              <img
                src={hotAirBalloon}
                alt="Hot Air Balloon"
                className="w-16 h-16"
              />
            </div>

            {/* Small plane */}
            <div className="absolute left-10 top-6 animate-move-right">
              <img src={airplaneIcon} alt="Airplane" className="w-16 h-16" />
            </div>
          </div>
        </div>
      </div>
    </SkyBackground>
  );
};

export default ContinentPage;
