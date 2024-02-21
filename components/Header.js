import { useState } from "react";
import React from "react";

import { MagnifyingGlassIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { StarIcon, MapIcon, UserCircleIcon } from "@heroicons/react/24/outline";

function Header({ setKeyword, toggleMapVisibility }) {
  const [inputValue, setInputValue] = useState("");

  // set the value of keyword. Main/index.js has hook with keyword as dependancy array to make the request to the API
  const handleSearch = () => {
    setKeyword(inputValue);
  };

  // use "enter" key aswell
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="flex items-center justify-between p-1 bg-white shadow-lg z-0">
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
        />
        <MagnifyingGlassIcon
          className="inline-flex h-8 w-8 bg-logoBlue text-white rounded-full p-2 cursor-pointer md:mx-2"
          onClick={handleSearch}
        />
      </div>

      {/* Icon Group */}
      <div className="flex items-center space-x-1 ml-2">
        <MapIcon
          className="h-8 cursor-pointer text-logoBlue"
          onClick={toggleMapVisibility}
        />
        <StarIcon className="h-8 cursor-pointer text-logoBlue" />
        <UserCircleIcon className="h-8 cursor-pointer text-logoBlue" />
      </div>
    </header>
  );
}

export default Header;
