import { useEffect, useState, useRef } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { SyncFavorites } from "@/utils/LoginUtils";

export const Cards = ({ markers, setSelectedCard, token }) => {
  const [favorites, setFavorites] = useState([]);
  const gridRef = useRef(null);
  const cardWidth = 170;

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
    SyncFavorites();
  }, [favorites]);

  useEffect(() => {
    // Dynamically import Masonry here
    import("masonry-layout")
      .then((Masonry) => {
        if (gridRef.current) {
          // Ensure Masonry is called correctly as a constructor
          new Masonry.default(gridRef.current, {
            itemSelector: ".grid-item",
            columnWidth: cardWidth,
            gutter: 10,
            fitWidth: true,
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
    <section className="flex items-center justify-center w-full">
      <div ref={gridRef} className="">
        {markers?.map((item) => {
          return (
            <div
              key={item.id}
              className="p-2 rounded-md my-1 border-2 grid-item group relative overflow-hidden transition-all duration-100 ease-in-out hover:scale-[1.03] cursor-pointer"
              onClick={() => setSelectedCard(item.coordinates)}
              style={{
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: cardWidth + "px",
                height: "150px",
              }}
            >
              <div className="flex flex-col justify-end h-full">
                <div className="z-50 p-2">
                  {token && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      aria-label="Toggle Favorite"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 outline-none focus:outline-none absolute top-2 right-2"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          favorites.includes(item.id)
                            ? "text-yellow-200"
                            : "text-white"
                        }`}
                      />
                    </button>
                  )}
                </div>
                <div className="z-10 transition-all duration-100 group-hover">
                  <p
                    className={`text-lg font-semibold ${
                      favorites.includes(item.id)
                        ? "text-yellow-200"
                        : "text-white"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-opacity-50 bg-slate-900 rounded-md"></div>{" "}
              {/* dark opacity cover box */}
            </div>
          );
        })}
      </div>
    </section>
  );
};
