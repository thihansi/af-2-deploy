import React from "react";
import airplane from "../../assets/images/airplane.png";

const SkyBackground = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900">
      {/* Fixed background container - no overflow-hidden */}
      <div className="fixed inset-0 z-0">
        {/* Enhanced stars system */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
        
        {/* Moon */}
        <div
          className="absolute top-16 right-24 w-20 h-20 md:w-32 md:h-32 rounded-full bg-yellow-100 
                       shadow-[0_0_60px_20px_rgba(254,240,138,0.3)] z-10 animate-pulse-slow"
        >
          {/* Moon craters */}
          <div className="absolute top-6 left-8 w-8 h-8 rounded-full bg-blue-950 opacity-10"></div>
          <div className="absolute bottom-4 right-6 w-6 h-6 rounded-full bg-blue-950 opacity-10"></div>
          <div className="absolute top-14 right-10 w-4 h-4 rounded-full bg-blue-950 opacity-10"></div>
        </div>

        {/* Airplane - keeping this as requested */}
        <img
          src={airplane}
          alt="Airplane"
          className="absolute top-32 right-20 w-24 md:w-32 z-20 animate-plane brightness-110"
        />
        
        {/* Enhanced twinkling stars */}
        <div className="absolute top-24 left-1/3 w-4 h-4 bg-yellow-100 rounded-full 
                       shadow-[0_0_12px_6px_rgba(254,240,138,0.6)] z-10 animate-twinkle"></div>
        <div className="absolute top-48 right-1/4 w-3 h-3 bg-yellow-100 rounded-full 
                       shadow-[0_0_8px_4px_rgba(254,240,138,0.6)] z-10 animate-twinkle-delay"></div>
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-yellow-50 rounded-full 
                       shadow-[0_0_10px_5px_rgba(254,240,138,0.5)] z-10 animate-twinkle-fast"></div>
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-yellow-100 rounded-full 
                       shadow-[0_0_8px_4px_rgba(254,240,138,0.6)] z-10 animate-twinkle-slow"></div>
        <div className="absolute bottom-24 right-24 w-3 h-3 bg-yellow-50 rounded-full 
                       shadow-[0_0_8px_4px_rgba(254,240,138,0.5)] z-10 animate-twinkle"></div>
                       
        {/* Additional stars for a more filled sky */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-yellow-50 rounded-full 
                       shadow-[0_0_6px_3px_rgba(254,240,138,0.4)] z-10 animate-twinkle-slow"></div>
        <div className="absolute top-3/4 left-2/3 w-2 h-2 bg-yellow-100 rounded-full 
                       shadow-[0_0_6px_3px_rgba(254,240,138,0.5)] z-10 animate-twinkle-delay"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-yellow-50 rounded-full 
                       shadow-[0_0_8px_4px_rgba(254,240,138,0.6)] z-10 animate-twinkle"></div>
        <div className="absolute top-1/6 right-1/6 w-2 h-2 bg-yellow-100 rounded-full 
                       shadow-[0_0_5px_3px_rgba(254,240,138,0.5)] z-10 animate-twinkle-fast"></div>
        <div className="absolute bottom-1/2 right-1/5 w-3 h-3 bg-yellow-50 rounded-full 
                       shadow-[0_0_7px_3px_rgba(254,240,138,0.5)] z-10 animate-twinkle-slow"></div>
      </div>

      {/* Content container - this is the key to making scrolling work! */}
      <div className="relative z-30 min-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default SkyBackground;