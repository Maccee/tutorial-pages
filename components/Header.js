import { useState } from "react";
import React from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  GlobeAltIcon
} from "@heroicons/react/24/solid";
import {
    StarIcon,
    MapIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";

function Header({ setKeyword, toggleMapVisibility }) {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    setKeyword(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 flex justify-between items-center p-1 bg-white z-50 shadow-lg">
      <div className="flex items-center">
        <div className="h-12 w-12 relative mr-2">
          <img
            src="/logo2.png"
            
            alt="logo"
          />
        </div>
      </div>

      <div className="flex flex-grow items-center max-w-xl">
        <div className="flex items-center md:border-2 rounded-full py-2 mx-2 md:shadow-sm w-full">
          <input
            className="flex-grow pl-2 bg-transparent outline-none text-gray-600 placeholder-gray-400"
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <MagnifyingGlassIcon
            className="hidden md:inline-flex h-12 bg-logoBlue text-white rounded-full p-2 cursor-pointer md:mx-2"
            onClick={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 justify-end text-logoBlue">
        <p className="hidden md:inline cursor-pointer text-gray-400">
          Logged In
        </p>

        <div className="flex items-center space-x-2 border-2 p-2 rounded-full">
          <MapIcon
            className="h-12 cursor-pointer"
            onClick={toggleMapVisibility}
          />
          <StarIcon className="h-12 cursor-pointer" />
          <UserCircleIcon className="h-12 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}

export default Header;
