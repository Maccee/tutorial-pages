import React, { useEffect, useState } from "react";
import { getImage } from "./ApiUtils";

export const Favorites = ({
  markers,
  setMarkers,
  favorites,
  setFavorites,
  favoriteMarkers,
  setFavoriteMarkers,
}) => {
  useEffect(() => {
    // Function to fetch data for a single favorite URL
    const fetchFavoriteDetails = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Check if the data has an image property and it's not null
        if (data.image) {
          // Fetch the image URL and replace the image ID with the URL in the data object
          const imageUrl = await getImage(data.image);
          data.imageUrl = imageUrl; // Add a new property for the URL or replace the existing image property as needed
        }

        return data;
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    // Fetch all favorites details
    const fetchAllFavorites = async () => {
      const promises = favorites.map((url) => fetchFavoriteDetails(url));
      const results = await Promise.all(promises);
      setFavoriteMarkers(results.filter((result) => result !== undefined));
    };

    fetchAllFavorites();
  }, [favorites]);

  return (
    <div className="flex gap-2 justify-center mt-8 text-white flex-wrap">
      {favoriteMarkers.map((card, index) => (
        <div key={index} className="border rounded mb-2 overflow-hidden relative" style={{
          width: "140px",
          height: "150px",
        }}>
          {/* Background Image */}
          <div style={{
            backgroundImage: `url(${card.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 1,
          }}></div>
  
          {/* Overlay */}
          <div className="absolute w-full h-full bg-slate-900 bg-opacity-50" style={{
            zIndex: 2,
          }}></div>
  
          {/* Text Content */}
          <div className="relative z-10 p-4">
            <h2 className="font-semibold">{card.name.fi}</h2>
            {/* Display more details as needed */}
          </div>
        </div>
      ))}
    </div>
  );
  

};
