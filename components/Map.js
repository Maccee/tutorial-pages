import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function Map({ position }) {

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
      <div>
        <MapContainer
          style={{ height: "600px" }}
          center={{ lat: 60.1705, lon: 24.9414 }}
          zoom={17}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <FlyToNewPosition newPosition={position} />
        </MapContainer>
      </div>
    </section>
  );
}

export default Map;
