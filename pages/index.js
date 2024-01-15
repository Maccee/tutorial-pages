import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (keyword) {
      fetch(
        `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true`
      )
        .then((response) => response.json())
        .then((result) => {
          setData(result.data);

          const newMarkers = result.data
            .filter((item) => item.position && item.position.coordinates) // Only include items with coordinates
            .map((item) => ({
              id: item.id,
              name: item.name.fi, // Adjust according to the structure of your data
              coordinates: item.position.coordinates,
            }));
          setMarkers(newMarkers);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [keyword]);

  return (
    <div className="">
      <Header setKeyword={setKeyword} />
      <main className="flex   sm:px-16">
        <section className="pt-6">
          <h2 className="text-4xl font-semibold pb-4">Near You</h2>

          {markers?.map((item) => (
            <div className="pr-4" key={item.id}>
              {item.name}
            </div>
          ))}
        </section>
        <section className="flex-grow">
          <MapComponentWithNoSSR markers={markers} />
        </section>
      </main>
    </div>
  );
}
