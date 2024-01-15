import jsonData from "../public/dataset.json";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ position }) {
  const [showPolyline, setShowPolyline] = useState(true);

  const togglePolyline = () => {
    setShowPolyline(!showPolyline); // toggle the state
  };

  function FlyToNewPosition({ newPosition }) {
    const map = useMap();

    useEffect(() => {
      if (newPosition) {
        map.flyTo(newPosition, map.getZoom());
      }
    }, [newPosition, map]);

    return null;
  }

  return (
    <section>
      <div className="relative">
        <MapContainer
          style={{ height: "600px" }}
          center={{ lat: 60.1705, lon: 24.9414 }}
          zoom={17}
          scrollWheelZoom={true}
        >
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}@2x@fi.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          
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
          <FlyToNewPosition newPosition={position} />
          
        </MapContainer>
        <button className=" z-10000 bg-white p-2 text-sm rounded shadow" onClick={togglePolyline}>
            {showPolyline ? "Hide Polyline" : "Show Polyline"}
          </button>
      </div>
    </section>
  );
}

export default Map;
