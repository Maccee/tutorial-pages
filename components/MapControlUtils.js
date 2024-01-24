import { useMap } from "react-leaflet";
import {
  GlobeAltIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/react/24/outline";

export const ZoomControl = ({ showAlue, setShowAlue }) => {
  const map = useMap();
  const toggleAlue = () => {
    setShowAlue(!showAlue);
  };
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
        className="text-xl w-12 h-12 bg-white text-white mb-1 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center"
      >
        <MagnifyingGlassPlusIcon className="h-6 text-logoBlue" />
      </button>
      <button
        onClick={zoomOut}
        className="text-xl w-12 h-12 bg-white text-white mb-1 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center"
      >
        <MagnifyingGlassMinusIcon className="h-6 text-logoBlue" />
      </button>
      <button
        onClick={toggleAlue}
        className="text-xl w-12 h-12 bg-white text-white mb-1 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-black"
        // Adjust top-[5rem] as needed to position below the ZoomControl
      >
        {showAlue ? (
          <GlobeAltIcon className="h-6 text-logoBlue" />
        ) : (
          <GlobeAltIcon className="h-6 text-gray-300" />
        )}
      </button>
    </div>
  );
};

export const flipCoordinates = (geoJson) => {
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

export const transformGeometryCollections = (geoJsonData) => {
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
