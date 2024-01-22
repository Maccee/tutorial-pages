import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { fetchData } from "@/components/ApiUtils";
import { Cards } from "@/components/Cards";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [isMapVisible, setIsMapVisible] = useState(true);

  useEffect(() => {
    if (keyword) {
      setMarkers([]); // Reset markers before fetching new data
      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true`;
      fetchData(initialUrl).then((fetchedMarkers) => {
        setMarkers(fetchedMarkers);
      });
    }
  }, [keyword]);

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div>
      <Header setKeyword={setKeyword} />

      <main className="relative justify-between xl:mx-24 z-0">
        <div
          className={`transition-all duration-500 ${
            isMapVisible
              ? "opacity-100 max-h-[500px] sticky top-[50px]"
              : "opacity-0 max-h-0"
          }`}
          style={{ overflow: "hidden" }}
        >
          <MapComponentWithNoSSR
            markers={markers}
            selectedCard={selectedCard}
          />
        </div>
        <button
          className="transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={toggleMapVisibility}
        >
          Toggle Map
        </button>
        <Cards markers={markers} setSelectedCard={setSelectedCard} />
      </main>
    </div>
  );
}
