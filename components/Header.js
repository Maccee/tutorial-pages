import { useEffect } from "react";
import React from "react";

import {
  toggleLoginVisibility,
  toggleMapVisibility,
  toggleAdjustmentsVisibility,
} from "./UtilityFunctions";
import {
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/solid";
import { StarIcon, MapIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { performSearch } from "./SearchUtils";

const Header = ({
  setKeyword,
  inputValue,
  setInputValue,
  isMapVisible,
  setIsMapVisible,
  isLoginVisible,
  setIsLoginVisible,
  isAdjustmentsVisible,
  setIsAdjustmentsVisible,
  isModalVisible,
  setIsModalVisible,
  token,
  setMapContainerHeight,
}) => {
  useEffect(() => {
    console.log("token set!");
  }, [token]);

  // SEARCH
  const handleSearch = () => {
    performSearch({ keyword: inputValue, setKeyword }).catch(console.error);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-lg z-0 px-2 py-1">
      {/* Logo */}
      <div className="flex items-center">
        <div className="h-12 w-12 relative mr-2">
          <img src="/logo2.png" alt="logo" />
        </div>
      </div>

      {/* SearchBar */}
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
            toggleAdjustmentsVisibility(
              isAdjustmentsVisible,
              setIsAdjustmentsVisible
            )
          }
        />
        <MagnifyingGlassIcon
          className="inline-flex h-8 w-8 bg-logoBlue text-white rounded-full p-2 cursor-pointer md:mx-1"
          onClick={handleSearch}
        />
      </div>

      {/* Icons */}
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
        <UserCircleIcon
          onClick={() =>
            toggleLoginVisibility(isModalVisible, setIsModalVisible)
          }
          className="h-8 cursor-pointer text-logoBlue hover:text-blue-800 hover:scale-110"
        />
      </div>
    </header>
  );
};

export default Header;
