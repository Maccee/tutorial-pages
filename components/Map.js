import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "next-leaflet-cluster";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import jsonDataHel from "../public/aluejakoHelsinki.json";
import jsonDataVan from "../public/aluejakoVantaa.json";
import jsonDataEsp from "../public/aluejakoEspoo.json";
import jsonDataKau from "../public/aluejakoKauniainen.json";

import {
  ZoomControl,
  transformGeometryCollections,
  flipCoordinates,
} from "./MapControlUtils";
import { UserLocationMarker } from "./UserLocationMarker";

// Put all markers to the map
function LocationMarkers({ markers }) {
  return (
    <>
      <MarkerClusterGroup chunkedLoading={true} showCoverageOnHover={false}>
        {markers
          ?.filter(
            (marker) =>
              Array.isArray(marker.coordinates) &&
              marker.coordinates.length === 2 &&
              marker.coordinates[0] != null &&
              marker.coordinates[1] != null
          )
          .map((marker, index) => (
            <Marker
              key={index}
              position={{
                lat: marker.coordinates[1],
                lng: marker.coordinates[0],
              }}
            >
              <Popup>
                <div className="scrollable overflow-y-auto max-h-40">
                  <p className="text-lg">{marker.name}</p>
                  <p className="text-2xs">{marker.description}</p>
                  <p className="text-2xs">{marker.apiUrl}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>
    </>
  );
}

function FavoriteLocationMarkers({ favoriteMarkers }) {
  const userIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>`;
  const customDivIcon = new L.DivIcon({
    html: userIconSVG,
    iconSize: [30, 30], // Adjust based on your SVG
    iconAnchor: [15, 15], // Adjust based on your SVG
    className: "my-custom-icon", // Custom class for further styling if needed
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

  return (
    <>
      <MarkerClusterGroup
        chunkedLoading={true}
        showCoverageOnHover={false}
        iconCreateFunction={createCustomIcon}
      >
        {favoriteMarkers
          ?.filter(
            (marker) =>
              Array.isArray(marker.position.coordinates) &&
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

function Map({
  markers,
  favoriteMarkers,
  selectedCard,
  setSelectedCard,
  setIsMapVisible,
  setUserLocation,
  userLocation,
}) {
  const center = { lat: 60.1705, lon: 24.9414 };
  const [showAlue, setShowAlue] = useState(false);
  const mapHeight = 300; // Initial map height

  const flippedGeojsonDataHel = flipCoordinates(jsonDataHel);
  const flippedGeojsonDataVan = flipCoordinates(jsonDataVan);
  const flippedGeojsonDataEsp = flipCoordinates(jsonDataEsp);
  const transformedEspooData = transformGeometryCollections(
    flippedGeojsonDataEsp
  );

  // geojson overlay styles
  const geoJsonStyle = {
    color: "blue",
    weight: 2,
    fillColor: "lightblue",
    fillOpacity: 0.5,
  };

  // when card clicked, focus on the selected card
  function FlyToSelectedCard({ selectedCard }) {
    const map = useMap();

    useEffect(() => {
      if (selectedCard) {
        //map.flyTo([60.264753787236685,24.849923151141372], 16); // Testing purposes for manual entry
        map.flyTo([selectedCard[1], selectedCard[0]], 18);
        setSelectedCard(null);

        setIsMapVisible(true);
      }
    }, [selectedCard]);

    return null;
  }

  // get the name of the area from the geojson and put it to the popup when area is clicked
  const onEachFeature = (feature, layer) => {
    let popupContent = "";
    if (feature.properties) {
      if (feature.properties["hel:nimi_fi"]) {
        popupContent = feature.properties["hel:nimi_fi"];
      } else if (feature.properties["kosanimi"]) {
        popupContent = feature.properties["kosanimi"];
      } else if (feature.properties["Nimi"]) {
        popupContent = feature.properties["Nimi"];
      } else if (feature.properties["Nimi"]) {
        popupContent = feature.properties["Nimi"];
      }
    }
    if (popupContent) {
      layer.bindPopup(popupContent);
    }
  };

  return (
    <section className="bg-white" style={{ overflow: "hidden" }}>
      <MapContainer
        style={{
          height: `${mapHeight}px`,
        }}
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}@2x@fi.png"
        />

        <FlyToSelectedCard selectedCard={selectedCard} />
        {showAlue && (
          <>
            <GeoJSON
              data={flippedGeojsonDataHel}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
            <GeoJSON
              data={flippedGeojsonDataVan}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
            <GeoJSON
              data={transformedEspooData}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
            <GeoJSON
              data={jsonDataKau}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
          </>
        )}

        <LocationMarkers markers={markers} userLocation={userLocation} />
        <FavoriteLocationMarkers favoriteMarkers={favoriteMarkers} />
        <UserLocationMarker userLocation={userLocation} />

        <ZoomControl
          showAlue={showAlue}
          setShowAlue={setShowAlue}
          setSelectedCard={setSelectedCard}
          setUserLocation={setUserLocation}
          userLocation={userLocation}
        />

        <div className="absolute top-2.5 left-2.5 z-50 bg-white bg-opacity-75 p-2.5 rounded-md text-lg font-bold">
          Results - {markers.length}
        </div>
      </MapContainer>
    </section>
  );
}

export default Map;
