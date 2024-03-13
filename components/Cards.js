import { useEffect, useState, useRef } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { SyncFavorites } from "@/utils/LoginUtils";
import Modal from "./Modal";

export const Cards = ({
  markers,
  setSelectedCard,
  token,
  favorites,
  setFavorites,
}) => {
  const gridRef = useRef(null);
  const cardWidth = 170;
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);

  useEffect(() => {
    const localData = localStorage.getItem("favorites");
    if (localData) {
      setFavorites(JSON.parse(localData));
    }
  }, []);

  useEffect(() => {
    const localData = localStorage.getItem("favorites");
    if (localData) {
      setFavorites(JSON.parse(localData));
    }
  }, [token]);

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

  const toggleFavorite = (id, item) => {
    const isFavorite = favorites.includes(id);
    const updatedFavorites = isFavorite
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      const localData = localStorage.getItem("favorites");
      const parsedFavorites = JSON.parse(localData);
      setFavorites(parsedFavorites);
    }

    SyncFavorites();
  };

  const openModalWithCardInfo = (item) => {
    setSelectedCardInfo(item);
    setIsCardModalVisible(true);
    setSelectedCard(item.coordinates);
  };

  return (
    <><section className="flex items-center justify-center w-full">
      <div ref={gridRef} className="">
        {markers?.map((item) => {
          const isFavorite = favorites.includes(item.apiUrl);
          return (
            <div
              key={item.id}
              className="p-2 rounded-md my-1 border-2 grid-item group relative overflow-hidden transition-all duration-100 ease-in-out hover:scale-[1.03] cursor-pointer"
              onClick={() => openModalWithCardInfo(item)}
              style={{
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: cardWidth + "px",
                height: "150px",
              }}
            >
              <div className="flex flex-col justify-end h-full">
                <div className="z-10 p-2">
                  {token && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.apiUrl, item);
                      }}
                      aria-label="Toggle Favorite"
                      className="opacity-100 transition-opacity duration-100 outline-none focus:outline-none absolute top-2 right-2"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${isFavorite ? "text-yellow-200" : "text-white"
                          }`}
                      />
                    </button>
                  )}
                </div>
                <div className="z-10 transition-all duration-100 group-hover">
                  <p
                    className={`text-lg font-semibold ${isFavorite ? "text-yellow-200" : "text-white"
                      }`}
                  >
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-opacity-50 bg-slate-900 rounded-md"></div>
            </div>
          );
        })}
      </div>
    </section>
      <Modal isVisible={isCardModalVisible} onClose={() => setIsCardModalVisible(false)}>
        {selectedCardInfo && (
          <div style={{ width: "90vw", maxWidth: "600px" }}>
            <h2>{selectedCardInfo.name}</h2>
            <img src={selectedCardInfo.imageUrl} alt={selectedCardInfo.name?.fi || selectedCardInfo.name?.en || 'N/A'} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
            <p>ID: {selectedCardInfo.id}</p>
            <p>Description: {selectedCardInfo.description}</p>
            <p>Website: <a href={selectedCardInfo.www} target="_blank" rel="noopener noreferrer">{selectedCardInfo.www}</a></p>
            <p>API URL: {selectedCardInfo.apiUrl}</p>
            <p>Coordinates: {selectedCardInfo.coordinates}</p>
            <p>Location URL: {selectedCardInfo.locationUrl}</p>
            <div>
              <h3>Offers:</h3>
              {selectedCardInfo.offers && selectedCardInfo.offers.map((offer, index) => (
                <div key={index}>
                  <p>Is Free: {offer.is_free ? 'Yes' : 'No'}</p>
                  <p>Info URL: <a href={offer.info_url?.fi || offer.info_url?.en || offer.info_url?.sv || '#'} target="_blank" rel="noopener noreferrer">{offer.info_url?.fi || offer.info_url?.en || offer.info_url?.sv || 'N/A'}</a></p>
                  <p>Description: {offer.description?.fi || offer.description?.en || offer.description?.sv || 'No description available'}</p>
                  <p>Price: {offer.price?.fi || offer.price?.en || offer.price?.sv || 'N/A'}</p>
                </div>
              ))}
            </div>
            <p>Start Time: {selectedCardInfo.startTime}</p>
            <p>End Time: {selectedCardInfo.endTime}</p>
            <p>Short Description: {selectedCardInfo.shortDescription?.fi || selectedCardInfo.shortDescription?.en || 'No short description available'}</p>
            <p>Info URL: <a href={selectedCardInfo.infoUrl?.fi || selectedCardInfo.infoUrl?.en || 'N/A'} target="_blank" rel="noopener noreferrer">{selectedCardInfo.infoUrl?.fi || selectedCardInfo.infoUrl?.en || 'N/A'}</a></p>
            <p>Provider: {selectedCardInfo.provider?.fi || selectedCardInfo.provider?.en || 'N/A'}</p>
            <p>Multiple Event Dates: {selectedCardInfo.multipleEventDates}</p>
          </div>
        )}



      </Modal>
    </>
  );
};
