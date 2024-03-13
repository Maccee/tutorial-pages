import React, { useState, useEffect} from "react";

import ProgressBar from "@/components/ProgressBar";
import Header from "@/components/Header";


import { Login } from "@/components/Login";
import { Cards } from "@/components/Cards";
import Modal from "@/components/Modal";

import { fetchAndSetMarkers } from "@/components/ApiUtils";
import { toggleMapVisibility } from "@/components/UtilityFunctions";

import { MapIcon } from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
import { Favorites } from "@/components/Favorites";
import { GetFavorites } from "@/utils/LoginUtils";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [favoriteMarkers, setFavoriteMarkers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedCard, setSelectedCard] = useState();

  // component visibility
  const [isMapVisible, setIsMapVisible] = useState(true);

  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavoritesVisible, setIsFavoritesVisible] = useState(false);

  const [favorites, setFavorites] = useState([]);

  const [token, setToken] = useState(null);

  const [mapContainerHeight, setMapContainerHeight] = useState(500); // Default height in pixels

  const [userLocation, setUserLocation] = useState(null);

  // search states
  const [eventsCheck, setEventsCheck] = useState(false);
  const [distance, setDistance] = useState(10); // Default distance set to 10km
  const [inputValue, setInputValue] = useState("");

 

  useEffect(() => {
    console.log("refreshed");
    GetFavorites();
  }, []);

  // hook to make a api request as the search keyword changes, its changed from the header component
  useEffect(() => {
    if (keyword) {
      fetchAndSetMarkers(
        keyword,
        eventsCheck,
        distance,
        setProgress,
        setMarkers
      );
    }
  }, [keyword]);

  return (
    <>
      <ProgressBar totalItems={100} itemsProcessed={progress} />
      <div className="sticky top-0 z-50">
        <Header
          setKeyword={setKeyword}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          isFavoritesVisible={isFavoritesVisible}
          setIsFavoritesVisible={setIsFavoritesVisible}
          token={token}
          eventsCheck={eventsCheck}
          setEventsCheck={setEventsCheck}
        />

        

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isLoginVisible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
          }`}
        >
          <Login
            setToken={setToken}
            setIsModalVisible={setIsModalVisible}
            token={token}
          />
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isMapVisible ? "opacity-100 " : "opacity-0"
          } relative`}
          style={{ maxHeight: `${mapContainerHeight}px` }}
        >
          <MapComponentWithNoSSR
          eventsCheck={eventsCheck}
          distance={distance}
            markers={markers}
            setMarkers={setMarkers}
            setProgress={setProgress}
            favoriteMarkers={favoriteMarkers}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            setIsMapVisible={setIsMapVisible}
            setUserLocation={setUserLocation}
            userLocation={userLocation}
          />
        </div>
        <div className="cursor-pointer absolute flex w-full items-center justify-center  pb-2">
          <MapIcon
            className="h-8 w-28 text-white rounded-b-lg overflow-hidden bg-logoBlue shadow-lg"
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

      <section
        className={`transition-all duration-300 overflow-hidden ${
          isFavoritesVisible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
        }`}
      >
        <Favorites
          markers={markers}
          setMarkers={setMarkers}
          favorites={favorites}
          setFavorites={setFavorites}
          favoriteMarkers={favoriteMarkers}
          setFavoriteMarkers={setFavoriteMarkers}
          setSelectedCard={setSelectedCard}
        />
      </section>

      <main className="z-0 mt-8">
        <Cards
          markers={markers}
          setMarkers={setMarkers}
          setSelectedCard={setSelectedCard}
          token={token}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </main>
      <footer className="w-full text-center p-4 mt-10" style={{ bottom: 0 }}>
        <p>Copyright © 2024</p>
      </footer>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <Login setToken={setToken} setFavorites={setFavorites} token={token} />
      </Modal>
    </>
  );
}
