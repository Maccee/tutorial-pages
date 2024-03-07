import { useEffect, useState, useRef } from "react";
import { StarIcon } from "@heroicons/react/24/outline";

export const Cards = ({ markers, setSelectedCard }) => {
  const [favorites, setFavorites] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("favorites");
      setFavorites(localData ? JSON.parse(localData) : []);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    // Dynamically import Masonry here
    import("masonry-layout")
      .then((Masonry) => {
        if (gridRef.current) {
          // Ensure Masonry is called correctly as a constructor
          new Masonry.default(gridRef.current, {
            itemSelector: ".grid-item",
            columnWidth: 150,
            gutter: 10,
          });
        }
      })
      .catch((error) => console.error("Failed to load Masonry", error));
  }, [markers]); // Rerun when markers change

  const toggleFavorite = (id) => {
    const isFavorite = favorites.includes(id);
    setFavorites(
      isFavorite
        ? favorites.filter((favId) => favId !== id)
        : [...favorites, id]
    );
  };

  return (
    <section className="relative">
      <div ref={gridRef} className="m-2" style={{ width: "100%" }}>
        {markers?.map((item) => (
          <div
            key={item.id}
            className="p-2 rounded-md my-1 border-2 grid-item group relative overflow-hidden min-h-[40px] transition-all duration-300 ease-in-out hover:scale-[1.035] cursor-pointer"
            onClick={() => setSelectedCard(item.coordinates)}
            style={{
              backgroundImage: `url(${item.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "150px"
            }}
          >
            <div className="relative z-10">
              <div className="reltive opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  aria-label="Toggle Favorite"
                  className="outline-none focus:outline-none"
                >
                  <StarIcon
                    className={`h-6 w-6 ${
                      favorites.includes(item.id)
                        ? "text-yellow-500"
                        : "text-white"
                    }`}
                  />
                </button>
              </div>
              <p className="text-lg font-semibold text-white">
                {item.name}
              </p>
            </div>

            <div className="absolute inset-0 bg-opacity-50 bg-slate-900 rounded-md"></div>
          </div>
        ))}
      </div>
    </section>
  );
};
