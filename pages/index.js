import React, { useState, useEffect } from "react";

import ProgressBar from "@/components/ProgressBar";
import Header from "@/components/Header";
import { Login } from "@/components/Login";
import { Cards } from "@/components/Cards";

import { fetchAndSetMarkers } from "@/components/ApiUtils";
import { toggleMapVisibility } from "@/components/UtilityFunctions";

import { MapIcon } from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
import { SearchAdjustments } from "@/components/SearchAdjustments";
const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isAdjustmentsVisible, setIsAdjustmentsVisible] = useState(false);

  const [progress, setProgress] = useState(0);
  const [token, setToken] = useState(null);
  const [mapContainerHeight, setMapContainerHeight] = useState(300); // Default height in pixels

  const [userLocation, setUserLocation] = useState(null);

  // hook to make a api request as the search keyword changes, its changed from the header component
  useEffect(() => {
    if (keyword) {
      fetchAndSetMarkers(keyword, setProgress, setMarkers);
    }
  }, [keyword]);

  return (
    <>
      <ProgressBar totalItems={100} itemsProcessed={progress} />
      <div className="sticky top-0 z-50">
        <Header
          setKeyword={setKeyword}
          isMapVisible={isMapVisible}
          setIsMapVisible={setIsMapVisible}
          isLoginVisible={isLoginVisible}
          setIsLoginVisible={setIsLoginVisible}
          isAdjustmentsVisible={isAdjustmentsVisible}
          setIsAdjustmentsVisible={setIsAdjustmentsVisible}
          token={token}
          setMapContainerHeight={setMapContainerHeight}
        />

        <div
          className={`transition-all duration-200 ${
            isAdjustmentsVisible
              ? "opacity-100 max-h-[500px]"
              : "opacity-0 max-h-0"
          }`}
        >
          <SearchAdjustments />
        </div>

        <div
          className={`transition-all duration-500 ${
            isLoginVisible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
          }`}
        >
          <Login setToken={setToken} token={token} />
        </div>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            isMapVisible ? "opacity-100 " : "opacity-0"
          } relative`}
          style={{ maxHeight: `${mapContainerHeight}px` }}
        >
          <MapComponentWithNoSSR
            markers={markers}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            setIsMapVisible={setIsMapVisible}
            setUserLocation={setUserLocation}
            userLocation={userLocation}
          />
        </div>
        <div className="cursor-pointer absolute flex w-full items-center justify-center  pb-2">
          <MapIcon
            className="h-6 w-28 text-white rounded-b-lg overflow-hidden bg-logoBlue shadow-lg"
            onClick={() =>
              toggleMapVisibility(
                isMapVisible,
                setIsMapVisible,
                setMapContainerHeight
              )
            }
          />
        </div>
      </div>

      <main className="z-0 mt-8">
        <Cards markers={markers} setSelectedCard={setSelectedCard} />
      </main>
      <footer className="w-full text-center p-4 mt-10" style={{ bottom: 0 }}>
        <p>Copyright © 2024</p>
      </footer>
    </>
  );
}
