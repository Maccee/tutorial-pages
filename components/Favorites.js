import React from "react";

export const Favorites = ({ favorites }) => {
    const [favoriteDataCards, setFavoriteDataCards] = []

    const fetchFavorite = () => {

    }
    return (
      <div>
        {favorites.map((favorite, index) => (
          <div key={index}>{favorite}</div>
        ))}
      </div>
    );
  };