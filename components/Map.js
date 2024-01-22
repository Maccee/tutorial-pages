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
          <Popup>
            {marker.name}
            {marker.description}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function ZoomControl() {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="flex flex-col absolute right-2 top-2 z-50">
      <button
        onClick={zoomIn}
        className="bg-blue-500 text-white p-2 mb-1 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        -
      </button>
    </div>
  );
}
function PolylineControl({ showPolyline, setShowPolyline }) {
  const togglePolyline = () => {
    setShowPolyline(!showPolyline);
  };

  return (
    <button
      onClick={togglePolyline}
      className="absolute right-2 top-[5rem] z-50 bg-white p-2 text-sm rounded shadow"
      // Adjust top-[5rem] as needed to position below the ZoomControl
    >
      {showPolyline ? "Hide Polyline" : "Show Polyline"}
    </button>
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
    <section className="">
      <MapContainer
        style={{ height: "300px" }}
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}@2x@fi.png"
        />
        <LocationMarkers markers={markers} />
        <FlyToSelectedCard selectedCard={selectedCard} />
        <Aluejako showPolyline={showPolyline} />
        <ZoomControl />
        <PolylineControl
          showPolyline={showPolyline}
          setShowPolyline={setShowPolyline}
        />
      </MapContainer>
    </section>
  );
}

export default Map;
