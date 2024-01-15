import proj4 from "proj4";

// Define the ETRS-GK25 projection
const etrsGK25Projection =
"+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";
// WGS84 projection
const wgs84Projection = "EPSG:4326";

// Convert a single coordinate
const convertCoordinate = (coordinate) => {
// No swapping, direct conversion
let converted = proj4(etrsGK25Projection, wgs84Projection, coordinate);
return [converted[1], converted[0]]; // Leaflet uses [latitude, longitude]
};

export { convertCoordinate };
