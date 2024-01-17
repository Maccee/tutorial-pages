import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Aluejako } from "./Aluejako";

function LocationMarkers({ markers }) {
  return (
    <>
      {markers?.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.coordinates[1], lng: marker.coordinates[0] }}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </>
  );
}

function Map({ markers, selectedCard }) {
  const center = { lat: 60.1705, lon: 24.9414 };
  const [showPolyline, setShowPolyline] = useState(false);

  function FlyToSelectedCard({ selectedCard }) {
    const map = useMap();

    useEffect(() => {
      if (selectedCard) {
        //map.flyTo([60.264753787236685,24.849923151141372], 16); // Testing purposes for manual entry
        map.flyTo([selectedCard[1], selectedCard[0]], 16);
      }
    }, [selectedCard, map]);

    return null;
  }

  const togglePolyline = () => {
    setShowPolyline(!showPolyline);
  };

  return (
    <section className="hidden md:block">
      <MapContainer
        style={{ height: "600px", width: "400px" }}
        center={center}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}@2x@fi.png"
        />

        <LocationMarkers markers={markers} />
        <FlyToSelectedCard selectedCard={selectedCard} />
        <Aluejako showPolyline={showPolyline} />
      </MapContainer>
      <button
        className="mt-2 bg-white p-2 text-sm rounded shadow"
        onClick={togglePolyline}
      >
        {showPolyline ? "Hide Polyline" : "Show Polyline"}
      </button>
    </section>
  );
}

export default Map;
