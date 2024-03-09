import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  GeoJSON,
} from "react-leaflet";
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

// Put all markers to the map
function LocationMarkers({ markers }) {
  return (
    <>
      <MarkerClusterGroup chunkedLoading={true} showCoverageOnHover={false}>
        {markers?.map((marker, index) => (
          <Marker
            key={index}
            position={{
              lat: marker.coordinates[1],
              lng: marker.coordinates[0],
            }}
          >
            <Popup>
              <div className="">
                <p className="text-lg">{marker.name}</p>
                <p className="text-2xs">{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </>
  );
}

function Map({ markers, selectedCard, setSelectedCard, setIsMapVisible }) {
  const center = { lat: 60.1705, lon: 24.9414 };
  const [showAlue, setShowAlue] = useState(false);
  const [mapHeight, setMapHeight] = useState(500); // Initial map height

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
              data={jsonDataKau}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
          </>
        )}

        <LocationMarkers markers={markers} />
        <ZoomControl showAlue={showAlue} setShowAlue={setShowAlue} />

        <div className="absolute top-2.5 left-2.5 z-50 bg-white bg-opacity-75 p-2.5 rounded-md text-lg font-bold">
          Results - {markers.length}
        </div>
      </MapContainer>
      
    </section>
  );
}

export default Map;
