import React, { useState, useCallback } from "react";
import GlobeVisualization from "../components/GlobeVisualization";
import GlobeControls from "../components/GlobeControls";
import Navbar from "../components/Navbar";

export default function Explore() {
  // Globe configuration state
  const [viewMode, setViewMode] = useState("realistic");
  const [isRotating, setIsRotating] = useState(true);
  
  // Functions to control the globe
  const toggleRotation = useCallback(() => {
    setIsRotating(prev => !prev);
  }, []);
  
  const handleResetView = useCallback(() => {
    console.log("Reset view triggered");
    // You might want to trigger a ref method from GlobeVisualization
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Main content - takes all remaining space */}
      <main className="flex-grow relative">
        <GlobeVisualization 
          viewMode={viewMode}
          isRotating={isRotating}
        />
        
        {/* Controls positioned at bottom left */}
        <div className="absolute bottom-4 left-4 z-10">
          <GlobeControls 
            viewMode={viewMode}
            setViewMode={setViewMode}
            toggleRotation={toggleRotation}
            isRotating={isRotating}
            handleResetView={handleResetView}
          />
        </div>
      </main>
    </div>
  );
}