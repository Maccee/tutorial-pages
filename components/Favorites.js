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
    const fetchFavoriteDetails = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
  
        // Initialize imageUrl as null
        let imageUrl = null;
  
        // Check if the data has an image property and it's not null
        if (data.image) {
          console.log("Image ID before calling getImage:", data.image); // Log the image ID or object
  
          // Fetch the image URL and replace the image ID with the URL in the data object
          imageUrl = await getImage(data.image);
  
          console.log("Image URL received from getImage:", imageUrl); // Log the URL or data received from getImage
        } else if (data.images && data.images[0] && data.images[0].url) {
          // Directly use the URL from data.images[0].url if data.image is not found
          imageUrl = data.images[0].url;
          console.log("Direct URL from data.images[0].url:", imageUrl); // Log the direct URL
        }
  
        // If an imageUrl was found or set, add it to the data object
        if (imageUrl) {
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
