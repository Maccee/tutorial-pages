import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { Cards } from "@/components/Cards";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [userLocation, setUserLocation] = useState();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (keyword) {
      setMarkers([]); // Reset markers before fetching new data

      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true&lat=25&lon=60&distance=5000`;
      fetchData(initialUrl);
    }
  }, [keyword]);

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
    if ("geolocation" in navigator) {
      console.log(userLocation)
      if (!userLocation) {
        console.log(userLocation)
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
  
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
  
          const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
          const geocodeResponse = await fetch(reverseGeocodeUrl);
          const geocodeData = await geocodeResponse.json();
          const suburb = geocodeData.address.suburb;
  
          setUserLocation({ latitude, longitude, suburb });
        } catch (error) {
          console.error("Error in getUserLocation:", error);
          return;  // Exit the function if there is an error
        }
      }
  
      // Check if suburb is defined in userLocation
      if (userLocation && userLocation.suburb) {
        const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${userLocation.suburb}`;
        await fetchData(initialUrl);
      } else {
        console.error("Suburb information is not available.");
      }
    } else {
      console.error("Geolocation is not supported in this browser.");
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
