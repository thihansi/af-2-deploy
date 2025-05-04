import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import airplane from '../../assets/icons/airplane.png';
import hotAirBalloon from '../../assets/icons/hot-air-balloon.png';
import rainbow from '../../assets/icons/rainbow.png';
import star from '../../assets/icons/star.png';
import shootingStarIcon from '../../assets/icons/shooting-star.png';

const ContinentsSection = ({ loading: parentLoading }) => {
  const [continentCounts, setContinentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated continent base data, combining North and South America
  const continentsBaseData = [
    {
      name: "Africa",
      description: "Where lions roar and elephants play!",
      color: "from-yellow-500 to-orange-500",
      emoji: "🦁",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      funFact: "Africa has the world's largest desert - the Sahara!"
    },
    {
      name: "Americas", // Combined Americas
      description: "From snowy mountains to beautiful rainforests!",
      color: "from-green-500 to-blue-500",
      emoji: "🦅",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      funFact: "The Americas have the world's longest mountain range - the Andes!"
    },
    {
      name: "Asia",
      description: "Home to pandas, tigers and yummy food!",
      color: "from-red-500 to-yellow-500",
      emoji: "🐼",
      image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      funFact: "Asia has the tallest mountain in the world - Mount Everest!"
    },
    {
      name: "Europe",
      description: "Castles, kings and queens, and yummy pastries!",
      color: "from-blue-500 to-purple-500",
      emoji: "🏰",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      funFact: "Europe has more countries close together than any other continent!"
    },
    {
      name: "Oceania",
      description: "Islands with kangaroos and koalas!",
      color: "from-teal-400 to-blue-500",
      emoji: "🦘",
      image: "https://plus.unsplash.com/premium_photo-1697730221799-f2aa87ab2c5d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      funFact: "Oceania has the Great Barrier Reef, the largest coral reef in the world!"
    },
    {
      name: "Antarctic",
      description: "A frozen wonderland with penguins!",
      color: "from-blue-300 to-blue-600",
      emoji: "🐧",
      image: "https://images.unsplash.com/photo-1687904477461-3b38aeef9e54?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      funFact: "Antarctica is the coldest, windiest and driest continent on Earth!"
    }
  ];

  // Fetch country counts from API
  useEffect(() => {
    const fetchCountryCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=region,subregion');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Count countries by continent/region with special handling
        const counts = data.reduce((acc, country) => {
          // Handle all regions
          if (country.region) {
            // Combine all Americas into one count
            if (country.region === 'Americas') {
              acc['Americas'] = (acc['Americas'] || 0) + 1;
            } else {
              acc[country.region] = (acc[country.region] || 0) + 1;
            }
          }
          return acc;
        }, {});
        
        // Add Antarctica count (few or no countries in API)
        counts['Antarctic'] = counts['Antarctic'] || 0;
        
        setContinentCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching country counts:', error);
        setError('Failed to load country counts');
        setLoading(false);
      }
    };

    fetchCountryCounts();
  }, []);

  // Combine base data with API counts
  const continentsData = continentsBaseData.map(continent => ({
    ...continent,
    countryCount: continentCounts[continent.name] || '?'
  }));

  // Single continent card component - more cute and kid-friendly
  const ContinentCard = ({ continent }) => {
    return (
      <Link 
        to={`/continents/${continent.name.toLowerCase()}`}
        className="group relative rounded-2xl overflow-hidden h-72 sm:h-80 block transition-transform transform hover:scale-[1.02] hover:shadow-xl border-4 border-white/20"
      >
        {/* Background image */}
        <img 
          src={continent.image} 
          alt={`${continent.name} continent`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${continent.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
        
        {/* Animated stars for kid-friendly feel */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="star-sm absolute top-[10%] left-[15%] animate-twinkle-slow"></div>
          <div className="star-md absolute top-[25%] right-[20%] animate-twinkle"></div>
          <div className="star-sm absolute bottom-[30%] left-[30%] animate-twinkle-fast"></div>
          <div className="star-md absolute bottom-[15%] right-[15%] animate-twinkle-delay"></div>
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top content */}
          <div className="flex justify-between items-start">
            <div className="bg-white/30 backdrop-blur-sm rounded-full p-4 text-4xl shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-12">
              {continent.emoji}
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white font-bold shadow-md">
              {continent.countryCount} countries
            </div>
          </div>
          
          {/* Bottom content */}
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 group-hover:bg-white/40">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">
              {continent.name}
            </h3>
            <p className="text-white text-sm md:text-base mb-3 drop-shadow-sm">
              {continent.description}
            </p>
            <div className="inline-flex items-center bg-yellow-400/90 text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow-md transform transition-transform group-hover:scale-105">
              Let's explore! 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Enhanced Fun fact badge - with better styling */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-[calc(100%-15px)] group-hover:translate-x-0 transition-transform duration-300">
            <div className="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 backdrop-blur-md text-blue-900 px-4 py-3 rounded-l-2xl text-xs font-bold shadow-lg max-w-[180px] border-l-4 border-white/40">
              <div className="flex items-center mb-1">
                <div className="text-lg mr-1">💡</div>
                <span className="uppercase tracking-wide text-[10px]">Fun Fact!</span>
              </div>
              {continent.funFact}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // The final loading state combines parent loading and this component's loading
  const isLoading = parentLoading || loading;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Floating decorative elements*/}

      <div className="absolute bottom-10 right-6 animate-spin-slow opacity-70">
        <img src={shootingStarIcon} alt="Spinning star" className="w-10 h-10" />
      </div>
      <div className="absolute top-1/3 right-0 translate-x-1/4 animate-pulse-slow opacity-70">
        <img src={shootingStarIcon} alt="Pulsing star" className="w-14 h-14" />
      </div>
      <div className="absolute top-2/3 left-10 animate-bounce-slow">
        <img src={shootingStarIcon} alt="Shooting star" className="w-16 h-16" />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Explore by Continent
            </h2>
            <p className="text-blue-200 text-sm">Click on a continent to discover its countries!</p>
          </div>
        </div>
        <Link to="/explore" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-yellow-300 font-bold py-2 px-5 rounded-full flex items-center self-start sm:self-auto transition-colors shadow-md">
          View 3D Globe
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 sm:h-80 bg-white/10 backdrop-blur-sm rounded-2xl border-4 border-white/10"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-blue-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-2 px-6 rounded-full font-bold shadow-md"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {continentsData.map((continent) => (
            <ContinentCard key={continent.name} continent={continent} />
          ))}
        </div>
      )}
      
 {/* Enhanced cute decorative elements */}
 <div className="relative h-32 mt-10">
        {/* Animated cloud */}
        <div className="absolute left-20 -top-6 transform -translate-x-1/2 animate-float-slow">
          <div className="cloud-shape bg-white/30 backdrop-blur-sm w-24 h-12 rounded-full"></div>
        </div>
        
        {/* Animated sparkle */}
        <div className="absolute left-1/4 -top-6 transform -translate-x-1/2 rotate-12">
        <img src={star} alt="Sparkle" className="w-16 h-16 animate-bounce-slow" />
        </div>
        
        {/* Animated star */}
        <div className="absolute right-1/4 -top-10 transform translate-x-1/2 -rotate-12">
        <img src={shootingStarIcon} alt="Sparkle" className="w-16 h-16 animate-bounce-slow" />
        </div>
        
        {/* Rainbow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <img src={rainbow} alt="Sparkle" className="w-16 h-16 animate-bounce-slow" />
        </div>
        
        {/* Hot air balloon */}
        <div className="absolute right-10 top-0 transform -translate-y-1/2 animate-float">
        <img src={hotAirBalloon} alt="Sparkle" className="w-16 h-16 animate-bounce-slow" />
        </div>
        
        {/* Small plane */}
        <div className="absolute left-10 top-6 animate-move-right">
        <img src={airplane} alt="Sparkle" className="w-16 h-16 animate-bounce-slow" />
        </div>
      </div>
    </div>
  );
};

export default ContinentsSection;