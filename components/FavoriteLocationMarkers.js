import React, { useState, useEffect } from 'react';
import {
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "next-leaflet-cluster";

export const FavoriteLocationMarkers = ({ favoriteMarkers }) => {

    const [enhancedMarkers, setEnhancedMarkers] = useState([]);

    useEffect(() => {
        // Define the function to fetch event coordinates from a URL
        const fetchEventCoordinates = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Assuming the API response structure, you might need to adjust the path to get coordinates
                const coordinates = [data.position.coordinates[0], data.position.coordinates[1]];
                return coordinates;
            } catch (error) {
                console.error("Fetching event coordinates failed:", error);
                return null; // Consider how to handle errors gracefully in your app
            }
        };

        const enhanceMarkers = async () => {
            const markersWithCoords = await Promise.all(favoriteMarkers.map(async (marker) => {
                if (marker.position?.coordinates) {
                    // Regular marker, no need to fetch data
                    return marker;
                } else if (marker.location?.["@id"]) {
                    // Event marker, fetch coordinates
                    const coordinates = await fetchEventCoordinates(marker.location["@id"]);
                    if (coordinates) {
                        return { ...marker, position: { coordinates } };
                    } else {
                        return marker; // Handle the case where fetching fails gracefully
                    }
                }
                return marker; // For any other cases that might not fit the criteria above
            }));

            setEnhancedMarkers(markersWithCoords);
        };

        enhanceMarkers();
    }, [favoriteMarkers]);


    const userIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>`;
    const customDivIcon = new L.DivIcon({
        html: userIconSVG,
        iconSize: [30, 30], 
        iconAnchor: [15, 15], 
        className: "my-custom-icon",
    });
    const createCustomIcon = (cluster) => {
        return L.divIcon({
            html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
          <div style="position: absolute; background-color: rgba(255, 255, 0, 0.5); width: 40px; height: 40px; border-radius: 20px; top: 0; left: 0; z-index: -1;"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 45px; height: 45px; z-index: 1;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          <div style="position: absolute;  color: black; font-weight: bold; z-index: 150;">
            ${cluster.getChildCount()}
          </div>
        </div>`,
            className: "my-custom-cluster-icon", // Add your custom class
            iconSize: L.point(40, 40, true),
        });
    };



    console.log(favoriteMarkers);

    return (
        <>
            <MarkerClusterGroup
                chunkedLoading={true}
                showCoverageOnHover={false}
                iconCreateFunction={createCustomIcon}
            >
                {enhancedMarkers
                    ?.filter(
                        (marker) =>
                            Array.isArray(marker.position?.coordinates) &&
                            marker.position.coordinates.length === 2 &&
                            marker.position.coordinates[0] != null &&
                            marker.position.coordinates[1] != null
                    )
                    .map((marker, index) => (
                        <Marker
                            key={index}
                            position={{
                                lat: marker.position.coordinates[1],
                                lng: marker.position.coordinates[0],
                            }}
                            icon={customDivIcon}
                        >
                            <Popup>
                                <div className="scrollable overflow-y-auto max-h-40">
                                    <p className="text-lg">{marker.name.fi}</p>
                                    {/* Display more marker details here if needed */}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MarkerClusterGroup>
        </>
    );
}