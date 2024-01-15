import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Image from "next/image";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [position, setPosition] = useState({ lat: 60.1705, lon: 24.9414 });

  useEffect(() => {
    if (keyword) {
      fetch(`https://api.hel.fi/linkedevents/v1/place/?text=${keyword}`)
        .then((response) => response.json())
        .then((result) => {
          const data = result.data;
          console.log(data);
          const lonlat = data[0].position.coordinates;
          const latlon = [lonlat[1], lonlat[0]];
          setPosition(latlon);
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
        </section>
        <section className="flex-grow">
          <MapComponentWithNoSSR position={position} />
        </section>
      </main>
    </div>
  );
}
