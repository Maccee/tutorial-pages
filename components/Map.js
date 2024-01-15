import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ position }) {
  const FlyTo = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position && position.lat && position.lon) {
        // map.flyTo([position.lat, position.lon], map.getZoom());
        map.flyTo([position.lat, position.lon], map.getZoom());
      }
    }, [position, map]);
    return null;
  };

  return (
    <section>
      <div>
        <MapContainer
          style={{ height: "300px" }}
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://kartta.hel.fi/paikkatietohakemisto/metadata/?id=298/{z}/{x}/{y}@2x@fi.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <FlyTo position={position} />
        </MapContainer>
      </div>
    </section>
  );
}

export default Map;
