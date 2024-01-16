import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { fetchData, selectAndFetch } from "@/components/ApiUtils";
import { Cards } from "@/components/Cards";
import paikat from "../public/paikat.json";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [geocodeData, setGeocodeData] = useState();
  const [selectedCard, setSelectedCard] = useState();

  useEffect(() => {
    if (keyword) {
      setMarkers([]); // Reset markers before fetching new data
      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true`;
      fetchData(initialUrl).then((fetchedMarkers) => {
        setMarkers(fetchedMarkers);
      });
    }
  }, [keyword]);

  useEffect(() => {
    console.log("selected card set", selectedCard);
  }, [selectedCard]);

  const getUserLocation = async () => {
    if (geocodeData) return;
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported in this browser.");
      return;
    }

    try {
      const {
        coords: { latitude, longitude },
      } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const geocodeData = await (await fetch(reverseGeocodeUrl)).json();
      setGeocodeData(geocodeData);
    } catch (error) {
      console.error("Error in getUserLocation:", error);
    }
  };

  return (
    <div className="">
      <Header setKeyword={setKeyword} />
      <main className="relative justify-between mx-2 mt-5 xl:mx-24">
        <button
          className="m-2 bg-white p-2 text-sm rounded shadow"
          onClick={getUserLocation}
        >
          Lähelläsi
        </button>
        <button
          className="m-2 bg-white p-2 text-sm rounded shadow"
          onClick={() => {
            setMarkers([]);
            selectAndFetch().then((fetchedMarkers) => {
              setMarkers(fetchedMarkers);
            });
          }}
        >
          Valitse6
        </button>

        <Cards markers={markers} setSelectedCard={setSelectedCard} />

        <div className="fixed top-[120px] right-10 h-screen max-h-screen">
          <MapComponentWithNoSSR
            markers={markers}
            selectedCard={selectedCard}
          />
        </div>
      </main>
    </div>
  );
}
