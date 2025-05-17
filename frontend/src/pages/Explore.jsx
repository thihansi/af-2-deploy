import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobeVisualization from "../components/GlobeVisualization";
import GlobeControls from "../components/GlobeControls";
import Navbar from "../components/Navbar";

export default function Explore() {
  const navigate = useNavigate();
  // Add ref for the globe visualization
  const globeRef = useRef(null);

  // Globe configuration state
  const [viewMode, setViewMode] = useState("realistic");
  const [isRotating, setIsRotating] = useState(true);

  // Functions to control the globe
  const toggleRotation = useCallback(() => {
    setIsRotating((prev) => !prev);
  }, []);

  // Update the reset handler to use the ref
  const handleResetView = useCallback(() => {
    console.log("Reset view triggered");
    if (globeRef.current) {
      globeRef.current.resetView();
    }
  }, []);

  // Handle country click
  const handleCountryClick = useCallback(
    (country) => {
      console.log("Country selected:", country);

      if (country.useNameFallback && country.name) {
        // If we're using the name fallback approach
        console.log("Navigating by name:", country.name);
        navigate(`/countries/name/${encodeURIComponent(country.name)}`);
      } else if (
        country &&
        (country.ISO_A3 || country.iso_a3 || country.cca3)
      ) {
        // Use code-based navigation if available
        const countryCode = country.ISO_A3 || country.iso_a3 || country.cca3;
        console.log("Navigating by code:", countryCode);
        navigate(`/countries/${countryCode}`);
      } else {
        console.error("Invalid country data:", country);
      }
    },
    [navigate]
  );

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Main content - takes all remaining space */}
      <main className="flex-grow relative">
        <GlobeVisualization
          ref={globeRef} // Pass the ref here
          viewMode={viewMode}
          isRotating={isRotating}
          onCountryClick={handleCountryClick}
        />

        {/* Controls positioned at bottom left */}
        <div className="absolute bottom-8 left-8 z-10">
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
