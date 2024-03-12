import React, { useState, useEffect, useRef } from "react";
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
import { FavoriteLocationMarkers } from "./FavoriteLocationMarkers";
import { fetchAndSetMarkers, fetchEventDataDivision } from "./ApiUtils";

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
                  <p className="text-xs">{marker.multipleEventDates}</p>
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



function Map({
  eventsCheck,
  distance,
  markers,
  setMarkers,
  setProgress,
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

  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on('popupopen', function (e) {
        const buttonId = e.popup._content.match(/id="([^"]+)"/)[1];
        if (buttonId) {
          const button = document.getElementById(buttonId);
          if (button) {
            button.onclick = () => {
              const areaName = buttonId.split('-').slice(1).join(' ');
              findEventsInArea(areaName);
            };
          }
        }
      });
    }
  }, []);

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
    if (feature.properties) {
      let areaName = feature.properties["hel:nimi_fi"] || feature.properties["kosanimi"] || feature.properties["Nimi"];
      if (areaName) {
        layer.on('click', () => {
          // Directly call findEventsInArea from here if possible
          findEventsInArea(areaName);
        });
      }
    }
  };


  function findEventsInArea(areaName) {
    console.log(`Finding events in ${areaName}`);
    const areaSearch = true;
    fetchAndSetMarkers( areaName, eventsCheck, distance, setProgress, setMarkers, areaSearch );
  }

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
