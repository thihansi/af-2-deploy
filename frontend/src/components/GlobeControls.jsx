import React from "react";
import { globeImageUrls } from "../utils/globeImageUrls";

const GlobeControls = ({ viewMode, setViewMode, toggleRotation, isRotating, handleResetView }) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 p-4 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(globeImageUrls).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition ${
                viewMode === mode
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={toggleRotation}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm ${
              isRotating
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-700"
            }`}
          >
            {isRotating ? "Pause" : "Rotate"}
          </button>

          <button
            onClick={handleResetView}
            className="flex-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobeControls;