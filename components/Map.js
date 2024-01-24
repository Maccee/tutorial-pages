import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import jsonDataHel from "../public/aluejakoHelsinki.json";
import jsonDataVan from "../public/aluejakoVantaa.json";
import jsonDataEsp from "../public/aluejakoEspoo.json";
import jsonDataKau from "../public/aluejakoKauniainen.json";

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
    <div className="flex flex-col absolute right-2 top-2">
      <button
        onClick={zoomIn}
        className="text-xl w-12 h-12 bg-blue-500 text-white  mb-1 rounded-full hover:bg-blue-700 transition duration-300"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="text-xl w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition duration-300"
      >
        -
      </button>
    </div>
  );
}
function PolylineControl({ showAlue, setShowAlue }) {
  const toggleAlue = () => {
    setShowAlue(!showAlue);
  };

  return (
    <button
      onClick={toggleAlue}
      className="absolute text-xl w-12 h-12 bottom-2 right-2 bg-white p-2 rounded shadow"
      // Adjust top-[5rem] as needed to position below the ZoomControl
    >
      {showAlue ? "HD" : "SP"}
    </button>
  );
}
const flipCoordinates = (geoJson) => {
  const flipCoords = (coords) => {
    if (Array.isArray(coords[0])) {
      return coords.map(flipCoords);
    }
    return [coords[1], coords[0]];
  };

  const flippedGeoJson = JSON.parse(JSON.stringify(geoJson)); // Deep copy

  flippedGeoJson.features.forEach((feature) => {
    if (feature.geometry && feature.geometry.coordinates) {
      feature.geometry.coordinates = flipCoords(feature.geometry.coordinates);
    }
  });

  return flippedGeoJson;
};
const transformGeometryCollections = (geoJsonData) => {
  const transformedFeatures = [];

  geoJsonData.features.forEach((feature) => {
    if (feature.geometry.type === "GeometryCollection") {
      feature.geometry.geometries.forEach((geometry) => {
        transformedFeatures.push({
          type: "Feature",
          properties: { ...feature.properties },
          geometry: { ...geometry },
        });
      });
    } else {
      transformedFeatures.push(feature);
    }
  });

  return { ...geoJsonData, features: transformedFeatures };
};

function Map({ markers, selectedCard, toggleMapVisibility }) {
  const center = { lat: 60.1705, lon: 24.9414 };
  const [showAlue, setShowAlue] = useState(false);

  const flippedGeojsonDataHel = flipCoordinates(jsonDataHel);
  const flippedGeojsonDataVan = flipCoordinates(jsonDataVan);
  const flippedGeojsonDataEsp = flipCoordinates(jsonDataEsp);
  const flippedGeojsonDataKau = flipCoordinates(jsonDataKau);

  const transformedEspooData = transformGeometryCollections(
    flippedGeojsonDataEsp
  );

  const geoJsonStyle = {
    color: "blue",
    weight: 2,
    fillColor: "lightblue",
    fillOpacity: 0.5,
  };

  function FlyToSelectedCard({ selectedCard }) {
    const map = useMap();

    useEffect(() => {
      if (selectedCard) {
        //map.flyTo([60.264753787236685,24.849923151141372], 16); // Testing purposes for manual entry
        map.flyTo([selectedCard[1], selectedCard[0]], 16);
      }
    }, [selectedCard]);

    return null;
  }

  const onEachFeature = (feature, layer) => {
    let popupContent = "";

    if (feature.properties) {
      // Check for Helsinki dataset
      if (feature.properties["hel:nimi_fi"]) {
        popupContent = feature.properties["hel:nimi_fi"];
      }
      // Check for Vantaa dataset
      else if (feature.properties["kosanimi"]) {
        popupContent = feature.properties["kosanimi"];
      }
      // Check for Espoo dataset
      else if (feature.properties["Nimi"]) {
        popupContent = feature.properties["Nimi"];
      }
      // Check for Kauniainen dataset
      else if (feature.properties["Nimi"]) {
        popupContent = feature.properties["Nimi"];
      }
    }

    if (popupContent) {
      layer.bindPopup(popupContent);
    }
  };

  return (
    <section className="bg-white">
      <MapContainer
        style={{
          height: "300px",

          backgroundColor: "white",
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
        <LocationMarkers markers={markers} />
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
              data={flippedGeojsonDataKau}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
          </>
        )}
        <LocationMarkers markers={markers} />
        <ZoomControl />
        <PolylineControl showAlue={showAlue} setShowAlue={setShowAlue} />
      </MapContainer>
    </section>
  );
}

export default Map;
