import React from "react";
import { performSearch } from "./SearchUtils";

export const SearchAdjustments = ({
  keyword,
  setKeyword,
  inputValue,
  setInputValue,
  eventsCheck,
  setEventsCheck,
  distance,
  setDistance,
}) => {
  const handleEventsCheckChange = () => {
    setEventsCheck(!eventsCheck);
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full pb-4 bg-white border-b-2">
        <div className="w-[400px] flex flex-col">
          Search For:
          <div className="flex flex-row justify-between">
            <div className="w-[100px]">
              <label className="flex items-center justify-between">
                <span>Events:</span>
                <input
                  type="checkbox"
                  checked={eventsCheck}
                  onChange={handleEventsCheckChange}
                  className="ml-2"
                />
              </label>

              <div className="flex flex-col items-center">
                Distance:
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={distance}
                  onChange={handleDistanceChange}
                  className="w-20"
                />
                <span className="text-xs">{distance} km</span>
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              {/* Removed buttons that are not connected to functionality for simplicity */}
              <button
                className="defaultButtonSmall"
                onClick={() =>
                  performSearch({ keyword: inputValue, setKeyword })
                }
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
