import jsonData from "../public/dataset.json";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function LocationMarkers({ markers }) {
  return (
    <>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.coordinates[1], lng: marker.coordinates[0] }} // Assuming coordinates array is [longitude, latitude]
        >
          <Popup>{marker.name}</Popup> {/* Optional Popup */}
        </Marker>
      ))}
    </>
  );
}

function Map({ markers }) {
  const [showPolyline, setShowPolyline] = useState(true);

  const togglePolyline = () => {
    setShowPolyline(!showPolyline); // toggle the state
  };

  return (
    <section>
      <div className="relative">
        <MapContainer
          style={{ height: "600px" }}
          center={{ lat: 60.1705, lon: 24.9414 }}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}@2x@fi.png"
          />
          <LocationMarkers markers={markers} />

          {showPolyline &&
            jsonData.features.map((feature, index) => (
              <Polyline
                key={index}
                color="blue"
                weight={1}
                opacity={0.7}
                interactive={true}
                className="my-custom-polyline"
                positions={feature.geometry.coordinates[0].map((coord) => [
                  coord[0], // longitude
                  coord[1], // latitude
                ])}
              />
            ))}
        </MapContainer>
        <button
          className="mt-2 z-10000 bg-white p-2 text-sm rounded shadow"
          onClick={togglePolyline}
        >
          {showPolyline ? "Hide Polyline" : "Show Polyline"}
        </button>
      </div>
    </section>
  );
}

export default Map;
