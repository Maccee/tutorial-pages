import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { Cards } from "@/components/Cards";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState();
  const [markers, setMarkers] = useState([]);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
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

        const updatedMarkers = [...accumulatedMarkers, ...newMarkers];

        if (updatedMarkers.length > 50) {
          setMarkers(updatedMarkers.slice(0, 50));
          return; // Stop fetching if the limit is reached or exceeded
        }

        setMarkers(updatedMarkers);
        setTotalCards(updatedMarkers.length);

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

    if (keyword) {
      setMarkers([]); // Reset markers before fetching new data
      setTotalCards(0);
      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true`;
      fetchData(initialUrl);
    }
  }, [keyword]);

  return (
    <div className="">
      <Header setKeyword={setKeyword} />
      <main className="relative flex justify-between mx-2 mt-5 xl:mx-24">
        <Cards markers={markers} />

        <div className="fixed top-[120px] right-10 h-screen max-h-screen">
          <MapComponentWithNoSSR markers={markers} />
        </div>
      </main>
    </div>
  );
}
