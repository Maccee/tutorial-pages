import React, { useEffect, useState } from "react";
import { getImage } from "./ApiUtils";
import Modal from "./Modal";

export const Favorites = ({
  markers,
  setMarkers,
  favorites,
  setFavorites,
  favoriteMarkers,
  setFavoriteMarkers,
  setSelectedCard
}) => {
  const [isFavoriteCardModalVisible, setIsFavoriteCardModalVisible] = useState(false);
  const [selectedFavoriteCardInfo, setSelectedFavoriteCardInfo] = useState(null);
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

  const openModalWithCardInfo = async (item) => {
    console.log(item);
    // Initialize a variable for coordinates
    let coordinates;

    // Check if item.position.coordinates is already available (for place data)
    if (item.position && item.position.coordinates) {
        // Directly use the available coordinates
        coordinates = item.position.coordinates;
    } else if (item.location && item.location['@id']) {
        // For event data, coordinates need to be fetched
        const url = item.location['@id'];

        try {
            // Fetch the data from the URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Extract coordinates from the fetched data
            // Assuming the response has a structure where the coordinates are under position.coordinates
            coordinates = data.position.coordinates;
        } catch (error) {
            console.error("Failed to fetch coordinates: ", error);
            return; // Exit if fetch fails
        }
    } else {
        console.error("No coordinates available");
        return; // Exit if no coordinates data is found
    }

    // Continue with setting modal information using the resolved coordinates
    setSelectedFavoriteCardInfo(item); // Set with the original item
    setIsFavoriteCardModalVisible(true);
    setSelectedCard(coordinates); // Use the resolved coordinates, either directly available or fetched
};




  return (
    <>
      <div className="flex gap-2 justify-center mt-8 text-white flex-wrap">
        {favoriteMarkers.map((card, index) => (
          <div key={index} className="border rounded mb-2 overflow-hidden relative" style={{
            width: "140px",
            height: "150px",
          }}
            onClick={() => openModalWithCardInfo(card)}>
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
      <Modal isVisible={isFavoriteCardModalVisible} onClose={() => setIsFavoriteCardModalVisible(false)}>
        {selectedFavoriteCardInfo && (
          <div style={{ width: "90vw", maxWidth: "600px" }}>
            <h2>{selectedFavoriteCardInfo.name.fi}</h2>
            <h2>{selectedFavoriteCardInfo.streetAddress}</h2>
            <img src={selectedFavoriteCardInfo.imageUrl} alt={selectedFavoriteCardInfo.name?.fi || selectedFavoriteCardInfo.name?.en || 'N/A'} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
            <p>ID: {selectedFavoriteCardInfo.id}</p>
            <p>Description: {selectedFavoriteCardInfo.description?.fi}</p>
            <p>Website: <a href={selectedFavoriteCardInfo.www} target="_blank" rel="noopener noreferrer">{selectedFavoriteCardInfo.www}</a></p>
            <p>API URL: {selectedFavoriteCardInfo.apiUrl}</p>
            <p>Coordinates: {selectedFavoriteCardInfo.coordinates}</p>
            <p>Location URL: {selectedFavoriteCardInfo.locationUrl}</p>
            <div>
              <h3>Offers:</h3>
              {selectedFavoriteCardInfo.offers && selectedFavoriteCardInfo.offers.map((offer, index) => (
                <div key={index}>
                  <p>Is Free: {offer.is_free ? 'Yes' : 'No'}</p>
                  <p>Info URL: <a href={offer.info_url?.fi || offer.info_url?.en || offer.info_url?.sv || '#'} target="_blank" rel="noopener noreferrer">{offer.info_url?.fi || offer.info_url?.en || offer.info_url?.sv || 'N/A'}</a></p>
                  <p>Description: {offer.description?.fi || offer.description?.en || offer.description?.sv || 'No description available'}</p>
                  <p>Price: {offer.price?.fi || offer.price?.en || offer.price?.sv || 'N/A'}</p>
                </div>
              ))}
            </div>
            <p>Start Time: {selectedFavoriteCardInfo.startTime}</p>
            <p>End Time: {selectedFavoriteCardInfo.endTime}</p>
            <p>Short Description: {selectedFavoriteCardInfo.shortDescription?.fi || selectedFavoriteCardInfo.shortDescription?.en || 'No short description available'}</p>
            <p>Info URL: <a href={selectedFavoriteCardInfo.infoUrl?.fi || selectedFavoriteCardInfo.infoUrl?.en || 'N/A'} target="_blank" rel="noopener noreferrer">{selectedFavoriteCardInfo.infoUrl?.fi || selectedFavoriteCardInfo.infoUrl?.en || 'N/A'}</a></p>
            <p>Provider: {selectedFavoriteCardInfo.provider?.fi || selectedFavoriteCardInfo.provider?.en || 'N/A'}</p>
            <p>Multiple Event Dates: {selectedFavoriteCardInfo.multipleEventDates}</p>
          </div>
        )}



      </Modal>
    </>
  );


};
