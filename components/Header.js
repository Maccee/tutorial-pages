import { useState, useEffect } from "react";
import React from "react";

import { toggleLoginVisibility, toggleMapVisibility, toggleAdjustmentsVisibility } from "./UtilityFunctions";
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { StarIcon, MapIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Header = ({
  setKeyword,
  isMapVisible,
  setIsMapVisible,
  isLoginVisible,
  setIsLoginVisible,
  isAdjustmentsVisible,
  setIsAdjustmentsVisible,
  token,
  setMapContainerHeight
}) => {
  const [inputValue, setInputValue] = useState("");

  // we need this to trigger the star icon color. Im working a different solution for this so hang on...
  // this re-renders the header component when token is changed. however if we remove the token manually from local storage
  // it wont trigger.. and that is not what we want.. We need some way to listen the local storage..
  useEffect(() => {
    console.log("token set!");
  }, [token]);

  // set the value of keyword. Main/index.js has hook with keyword as dependancy array to make the request to the API
  const handleSearch = () => {
    setKeyword("");
    setKeyword(inputValue);
  };

  // use "enter" key aswell
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

const handleAdjustments = () => {
  console.log("handleadjustmets")
}


  return (
    <header
      className="flex items-center justify-between bg-white shadow-lg z-0"
      style={{
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "3px",
        paddingBottom: "3px",
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="h-12 w-12 relative mr-2">
          <img src="/logo2.png" alt="logo" />
        </div>
      </div>

      {/* Search Area */}
      <div className="flex flex-grow items-center border-2 p-1 rounded-full min-w-0">
        <input
          className="flex-grow bg-transparent outline-none min-w-0"
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ paddingLeft: ".5rem" }}
        />
        <AdjustmentsVerticalIcon
          className="inline-flex h-8 w-8 bg-white text-logoBlue rounded-full cursor-pointer md:mx-1"
          onClick={() =>
            toggleAdjustmentsVisibility(isAdjustmentsVisible, setIsAdjustmentsVisible)
          }
        />
        <MagnifyingGlassIcon
          className="inline-flex h-8 w-8 bg-logoBlue text-white rounded-full p-2 cursor-pointer md:mx-1"
          onClick={handleSearch}
        />
      </div>

      {/* Icon Group */}
      <div className="flex items-center space-x-1 ml-2">
        <MapIcon
          className="h-8 cursor-pointer text-logoBlue hover:text-blue-800 hover:scale-110"
          onClick={() =>
            toggleMapVisibility(
              isMapVisible,
              setIsMapVisible,
              setMapContainerHeight
            )
          }
        />

        <StarIcon
          className={`h-8 cursor-pointer ${
            token ? "text-logoBlue" : "text-gray-200"
          }`}
        />

        {/* login */}
        <UserCircleIcon
          onClick={() =>
            toggleLoginVisibility(isLoginVisible, setIsLoginVisible)
          }
          className="h-8 cursor-pointer text-logoBlue hover:text-blue-800 hover:scale-110"
        />
      </div>
      
    </header>
  );
};

export default Header;
