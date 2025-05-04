import React from "react";
import cloud1 from "../../assets/images/cloud1.png";
import cloud2 from "../../assets/images/cloud2.png";
import compass from "../../assets/images/compass.png";
import airplane from "../../assets/images/airplane.png";
import map from "../../assets/images/map.png";
import passport from "../../assets/images/passport.png";
import travelerKid from "../../assets/images/night-traveler.png";
import hotAirBalloon from "../../assets/images/hot-air-balloon.png";

const DarkSkyBackground = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900">
      {/* Stars */}
      <div className="absolute inset-0 z-0">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      {/* Moon */}
      <div
        className="absolute top-16 right-24 w-20 h-20 md:w-28 md:h-28 rounded-full bg-yellow-100 
                      shadow-[0_0_40px_15px_rgba(254,240,138,0.3)] z-10 animate-pulse-slow"
      />
      {/* Moon crater */}
      <div className="absolute top-20 right-28 w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-950 opacity-10 z-11" />

      {/* Clouds using images - with reduced opacity for night effect */}
      <img
        src={cloud1}
        alt="Fluffy cloud"
        className="absolute top-36 left-20 w-32 md:w-48 z-10 animate-float-slow opacity-60"
      />

      <img
        src={cloud2} 
        alt="White cloud"
        className="absolute top-24 right-1/3 w-40 md:w-56 z-10 animate-float opacity-60"
      />

      <img
        src={cloud2} 
        alt="Small cloud"
        className="absolute bottom-60 left-1/4 w-24 md:w-36 z-10 animate-float-medium opacity-60"
      />

      {/* Travel elements - repositioned to avoid overlaps */}
      <img
        src={airplane}
        alt="Airplane"
        className="absolute top-32 right-20 w-24 md:w-32 z-20 animate-plane brightness-110"
      />

      <img
        src={hotAirBalloon}
        alt="Hot air balloon"
        className="absolute top-80 left-20 w-20 md:w-28 z-20 animate-float-medium brightness-110"
      />

      <img
        src={map}
        alt="World map"
        className="absolute bottom-40 right-32 w-32 md:w-48 z-10 animate-rotate-slow brightness-110"
      />

      <img
        src={passport}
        alt="Passport"
        className="absolute bottom-36 left-40 w-16 md:w-24 z-20 animate-bounce-slow brightness-115"
      />

      <img
        src={compass}
        alt="Compass"
        className="absolute top-1/2 right-40 w-16 md:w-20 z-20 animate-spin-slow brightness-115"
      />

      {/* Kid travelers */}
      <img
        src={travelerKid}
        alt="Kid traveler"
        className="absolute bottom-20 left-20 w-20 md:w-32 z-20 animate-wave brightness-110"
      />
      
      {/* Add some twinkling stars */}
      <div className="absolute top-24 left-1/3 w-4 h-4 bg-yellow-100 rounded-full 
                     shadow-[0_0_8px_4px_rgba(254,240,138,0.6)] z-10 animate-twinkle"></div>
      <div className="absolute top-48 right-1/4 w-3 h-3 bg-yellow-100 rounded-full 
                     shadow-[0_0_6px_3px_rgba(254,240,138,0.6)] z-10 animate-twinkle-delay"></div>
      <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-yellow-50 rounded-full 
                     shadow-[0_0_6px_3px_rgba(254,240,138,0.5)] z-10 animate-twinkle-fast"></div>
      <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-yellow-100 rounded-full 
                     shadow-[0_0_8px_4px_rgba(254,240,138,0.6)] z-10 animate-twinkle-slow"></div>
      <div className="absolute bottom-24 right-24 w-3 h-3 bg-yellow-50 rounded-full 
                     shadow-[0_0_6px_3px_rgba(254,240,138,0.5)] z-10 animate-twinkle"></div>

      {/* Content goes here */}
      <div className="relative z-30 min-h-screen">{children}</div>
    </div>
  );
};

export default DarkSkyBackground;