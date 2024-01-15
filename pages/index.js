import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Image from "next/image";

const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [exploreData, setExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Update position state
        setPosition({ lat: 60.1719, lon: 24.9414 });

        // Assuming fetchEventData is a function that you've defined
        // which takes longitude and latitude as arguments
        const address = await fetchEventData(longitude, latitude);

        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        // Handle error or set default location
        // For example: setPosition({ lat: defaultLatitude, lon: defaultLongitude });
      }
    );
  }, []);

  async function fetchEventData(lon, lat) {
    try {
      console.log(
        `https://api.hel.fi/linkedevents/v1/event/?dwithin_origin=${lon},${lat}&dwithin_metres=2000`
      );
      const response = await fetch(
        `https://api.hel.fi/servicemap/v2/unit/?lat=60.335961618950684&lon=25.016381244875742&distance=1000
        `
      );
      const json = await response.json();
      setExploreData(json.results);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  }

  return (
    <div className="">
      <Header />
      <Banner />

      <main className="max-w-7xl mx-auto px-8 sm:px-16">
        <section className="pt-6">
          <h2 className="text-4xl font-semibold pb-4">Near You</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            exploreData.map((item) => (
              <div className="pb-3" key={item.id}>
                <h1>{item.name.fi}</h1>

                {/* Other details */}
              </div>
            ))
          )}
        </section>
        <MapComponentWithNoSSR position={position} />
      </main>
    </div>
  );
}
