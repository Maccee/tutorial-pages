import React, { useState } from "react";

export const SearchAdjustments = () => {
  const [eventsCheck, setEventsCheck] = useState(false);
  const [distance, setDistance] = useState(10); // Default distance set to 10km

  const handleEventsCheckChange = () => {
    setEventsCheck(!eventsCheck);
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  return (
    <div className="flex justify-center m-4 items-center gap-4">
      Search for:
      <label>
        Events{" "}
        <input
          type="checkbox"
          checked={eventsCheck}
          onChange={handleEventsCheckChange}
          className="ml-2"
        />
      </label>
      <label>
        Places{" "}
        <input
          type="checkbox"
          checked={eventsCheck}
          onChange={handleEventsCheckChange}
          className="ml-2"
        />
      </label>
      <button className="border-2 p-1 rounded-lg flex items-center justify-center">
        Near me
      </button>
      {/* Slider */}
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={distance}
          onChange={handleDistanceChange}
          className="w-20"
        />
        <span>{distance} km</span>
      </div>
      <button className="border-2 p-1 rounded-lg flex items-center justify-center">
        Events now!
      </button>
    </div>
  );
};
