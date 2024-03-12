import React, { useState, useEffect } from "react";

// Custom hook for periodically checking local storage
function useLocalStorageWatcher(key, interval = 1000) {
  // Initialize state with a function that checks for window to avoid issues during SSR
  const [value, setValue] = useState(() => {
    // Check if we are in the browser environment
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  });

  useEffect(() => {
    // Ensure localStorage usage only occurs in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    const intervalId = setInterval(() => {
      const newValue = localStorage.getItem(key);
      if (newValue !== value) {
        setValue(newValue);
      }
    }, interval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [value, key, interval]);

  return value;
}

export const Favorites = ({ setSelectedCard }) => {
  const favoritesData = useLocalStorageWatcher("favorites");
  const [favoriteCards, setFavoriteCards] = useState([]);

  const fetchFavoritesData = async () => {
    // Safely parse the potentially null favoritesData
    const favoritesUrls = favoritesData ? JSON.parse(favoritesData) : [];
    const requests = favoritesUrls.map((url) =>
      fetch(url).then((res) => res.json())
    );
    const responses = await Promise.all(requests);
    setFavoriteCards(responses);
  };

  useEffect(() => {
    if (favoritesData) {
      fetchFavoritesData();
    }
  }, [favoritesData]);

  const handleClick = async (card) => {
    // Check if this is a place with coordinates
    if (card.position?.coordinates) {
      setSelectedCard(card.position.coordinates);
    } else {
      setSelectedCard(card.locationCoordinates);
    }
  };

  return (
    <div className="z-0 mt-8 mx-2">
      Favorites
      <div>
        {favoriteCards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(card)}
            className="p-2 rounded-md my-1 border-2 grid-item group relative overflow-hidden transition-all duration-100 ease-in-out hover:scale-[1.03] cursor-pointer"
          >
            {card.name?.fi}
          </div>
        ))}
      </div>
    </div>
  );
};
