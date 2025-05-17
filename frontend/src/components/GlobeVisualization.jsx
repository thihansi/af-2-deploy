import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Globe from "react-globe.gl";
import { feature } from "topojson-client";
import { globeImageUrls } from "../utils/globeImageUrls";

const GlobeVisualization = forwardRef(
  (
    {
      viewMode = "realistic",
      isRotating = true,
      onCountryClick, // Add this prop to receive the click handler from parent
    },
    ref
  ) => {
    const [countries, setCountries] = useState({ features: [] });
    const [isLoading, setIsLoading] = useState(true);
    const globeRef = useRef();

    // Load country data
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          // 1. Load geometry from TopoJSON
          const worldRes = await fetch(
            "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
          );
          const worldData = await worldRes.json();
          const geoData = feature(worldData, worldData.objects.countries);

          // 2. Load metadata from REST Countries
          const restRes = await fetch("https://restcountries.com/v3.1/all");
          const restData = await restRes.json();
          const countryMap = {};
          restData.forEach((c) => {
            if (c.cca3) countryMap[c.cca3] = c;
          });

          // 3. Merge metadata into GeoJSON properties
          geoData.features.forEach((f) => {
            f.properties.randomColor = `hsl(${Math.floor(
              Math.random() * 360
            )}, 80%, 60%)`;

            // Try to find the matching country in REST Countries data
            let matchingCountry = null;

            // Match by ISO code if it exists
            if (f.properties.iso_a3) {
              matchingCountry = restData.find(
                (c) => c.cca3 === f.properties.iso_a3
              );
            }

            // If no match yet, try by name
            if (!matchingCountry && f.properties.name) {
              matchingCountry = restData.find(
                (c) =>
                  c.name.common.toLowerCase() ===
                    f.properties.name.toLowerCase() ||
                  (c.name.official &&
                    c.name.official.toLowerCase() ===
                      f.properties.name.toLowerCase())
              );
            }

            // Store the country code in both formats to ensure we have it
            if (matchingCountry && matchingCountry.cca3) {
              f.properties.ISO_A3 = matchingCountry.cca3;
              f.properties.iso_a3 = matchingCountry.cca3;
            }

            // Also store the full REST Countries data
            f.properties.meta = matchingCountry;

            // Debug a few countries
            if (geoData.features.indexOf(f) < 3) {
              console.log("Country processed:", f.properties.name, {
                iso_a3: f.properties.iso_a3,
                ISO_A3: f.properties.ISO_A3,
                hasMetadata: !!f.properties.meta,
              });
            }
          });

          setCountries(geoData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading data:", error);
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    useEffect(() => {
      if (globeRef.current && !isLoading) {
        globeRef.current.pointOfView({ altitude: 2.5 }, 0);
      }
    }, [isLoading]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (globeRef.current) {
          const controls = globeRef.current.controls();
          if (controls) {
            controls.autoRotate = isRotating;
            controls.autoRotateSpeed = 0.5;
          }
        }
      }, 300); // slight delay after mount

      return () => clearTimeout(timeout);
    }, [isRotating]);

    // Handle polygon click to navigate to country page
    // Handle polygon click to navigate to country page
    const handleCountryClick = (polygon) => {
      console.log("Country clicked:", polygon); // Debug what's being clicked

      if (onCountryClick && polygon && polygon.properties) {
        // Track if we found a valid ID
        let foundValidId = false;

        // Try different possible property names for the country code
        // Check if polygon has iso_a3 or ISO_A3 directly
        const countryCode =
          polygon.properties.ISO_A3 || polygon.properties.iso_a3;

        if (countryCode && countryCode !== "-99") {
          console.log("Country code found:", countryCode);
          foundValidId = true;

          // Call the parent's click handler with the country data
          onCountryClick({
            ISO_A3: countryCode,
            name: polygon.properties.name,
          });
        }
        // Look for an attached metadata object that might have cca3
        else if (polygon.properties.meta && polygon.properties.meta.cca3) {
          console.log(
            "Country code found in metadata:",
            polygon.properties.meta.cca3
          );
          foundValidId = true;

          onCountryClick({
            ISO_A3: polygon.properties.meta.cca3,
            name: polygon.properties.name,
          });
        }
        // Only use name as last resort
        else if (polygon.properties.name && !foundValidId) {
          console.log("No code found, using name:", polygon.properties.name);
          onCountryClick({
            useNameFallback: true,
            name: polygon.properties.name,
          });
        } else {
          console.error("No valid identification found for country");
        }
      } else {
        console.error("Invalid polygon data or missing onCountryClick handler");
      }
    };

    const getPolygonLabel = (d) => {
      if (!d?.properties?.name) return "";
      return `
      <div style="
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        padding: 8px 12px;
        font-family: Arial, sans-serif;
        text-align: center;
        color: #333;
        pointer-events: none;
      ">
        <span style="font-weight: bold">${d.properties.name}</span>
      </div>
    `;
    };

    // Expose the reset function to parent via ref
    useImperativeHandle(ref, () => ({
      resetView: () => {
        if (globeRef.current) {
          // Reset to default position with animation
          globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);
          console.log("Globe view reset to default position");
        }
      },
    }));

    return (
      <div className="flex justify-center items-center h-full w-full overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-lg font-medium">Loading globe data...</div>
          </div>
        ) : (
          <Globe
            ref={globeRef}
            globeImageUrl={globeImageUrls[viewMode].globe}
            backgroundImageUrl={globeImageUrls[viewMode].background}
            polygonsData={countries.features}
            polygonAltitude={0.01}
            polygonCapColor={(d) =>
              viewMode === "cartoon"
                ? d.properties.randomColor
                : "rgba(200, 200, 200, 0.3)"
            }
            polygonSideColor={() => "rgba(150, 150, 150, 0.2)"}
            polygonStrokeColor={() => "rgba(255, 255, 255, 0.3)"}
            polygonLabel={getPolygonLabel}
            onPolygonClick={(polygon, event, { lat, lng, altitude }) => {
              console.log("Clicked:", { polygon, lat, lng });
              handleCountryClick(polygon);
            }}
            polygonsTransitionDuration={300}
            width={window.innerWidth}
            height={window.innerHeight - 80}
            // Add hover effect for better UX
            onPolygonHover={(polygon) => {
              if (polygon) {
                document.body.style.cursor = "pointer";
              } else {
                document.body.style.cursor = "default";
              }
            }}
          />
        )}
      </div>
    );
  }
);

export default GlobeVisualization;
