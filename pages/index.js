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
    <>
      <div className="sticky top-0 z-50">
        <Header
          setKeyword={setKeyword}
          toggleMapVisibility={toggleMapVisibility}
        />
        <div
          className={`transition-all duration-500 ${
            isMapVisible ? "opacity-100 max-h-[500px] " : "opacity-0 max-h-0"
          }`}
          style={{ overflow: "hidden", zIndex: "10" }}
        >
          <MapComponentWithNoSSR
            markers={markers}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            setIsMapVisible={setIsMapVisible}
          />
        </div>
      </div>
      <main className="z-0">
        <Cards markers={markers} setSelectedCard={setSelectedCard} />
      </main>
    </>
  );
}
