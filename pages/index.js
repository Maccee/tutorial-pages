import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { Cards } from "@/components/Cards";
import paikat from "../public/paikat.json";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [geocodeData, setGeocodeData] = useState();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (keyword) {
      setMarkers([]); // Reset markers before fetching new data
      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true`;
      fetchData(initialUrl);
    }
  }, [keyword]);

  useEffect(() => {
    if (!run) {
      selectAndFetch();
      setRun(true);
    }
  }, []);

  const selectAndFetch = async () => {
    const allPlaces = paikat; // This should be your array of places from the JSON file
    let selectedPlaces = [];
    let selectedNames = new Set(); // Set to keep track of selected place names

    // Randomly select places without duplicates
    while (selectedPlaces.length < 6) {
      const randomIndex = Math.floor(Math.random() * allPlaces.length);
      const place = allPlaces[randomIndex];

      if (!selectedNames.has(place.name)) {
        selectedPlaces.push(place);
        selectedNames.add(place.name); // Add the name to the Set
      }
    }
    console.log(selectedPlaces);

    // Process each selected place
    for (const place of selectedPlaces) {
      const url = `https://api.hel.fi/linkedevents/v1/place/?text=${encodeURIComponent(
        place.name
      )}&has_upcoming_event=true&show_all_places=true`;

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.data.length > 0) {
          const item = result.data[0];

          // Check if item.image is null. If so, skip to the next iteration
          if (!item.image) {
            const imageSearchUrl = `https://api.hel.fi/linkedevents/v1/image/?text=${encodeURIComponent(
              place.name
            )}`;
            const imageResponse = await fetch(imageSearchUrl);
            const imageResult = await imageResponse.json();

            if (imageResult.data.length > 0) {
              item.image = imageResult.data[0].url;
            } else {
              continue; // Skip if no image is found
            }
          }

          let imageUrl = await getImage(item.image); // Assuming getImage is defined elsewhere

          const marker = {
            id: item.id,
            name: item.name.fi,
            description: item.description?.fi
              ? (item.description.fi.match(/^[^,.]*/) || [])[0] + "."
              : "",
            imageUrl,
            coordinates: item.position.coordinates,
          };

          setMarkers((currentMarkers) => [...currentMarkers, marker]);
        }
      } catch (error) {
        console.error("Error fetching data for place:", place.name, error);
      }
    }
  };

  async function fetchData(url, accumulatedMarkers = []) {
    try {
      const response = await fetch(url);
      const result = await response.json();

      const newMarkers = await Promise.all(
        result.data
          .filter((item) => item.position && item.position.coordinates)
          .filter((item) => !item.id.startsWith("osoite"))
          .map(async (item) => {
            let imageUrl = "";
            if (item.image) {
              imageUrl = await getImage(item.image);
            }
            return {
              id: item.id,
              name: item.name.fi,
              description: item.description?.fi
                ? (item.description.fi.match(/^[^,.]*/) || [])[0] + "."
                : "",
              imageUrl,
              coordinates: item.position.coordinates,
            };
          })
      );
      console.log(result.data);
      const updatedMarkers = [...accumulatedMarkers, ...newMarkers];

      if (updatedMarkers.length > 50) {
        setMarkers(updatedMarkers.slice(0, 50));
        return; // Stop fetching if the limit is reached or exceeded
      }

      setMarkers(updatedMarkers);

      if (result.meta.next) {
        await fetchData(result.meta.next, updatedMarkers); // Pass accumulated markers
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getImage(imageId) {
    try {
      const response = await fetch(
        `https://api.hel.fi/linkedevents/v1/image/${imageId}`
      );
      const imageData = await response.json();
      return imageData.url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return "";
    }
  }

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
          className="my-2 bg-white p-2 text-sm rounded shadow"
          onClick={getUserLocation}
        >
          Lähelläsi
        </button>

        <Cards markers={markers} />

        <div className="fixed top-[120px] right-10 h-screen max-h-screen">
          <MapComponentWithNoSSR markers={markers} />
        </div>
      </main>
    </div>
  );
}
