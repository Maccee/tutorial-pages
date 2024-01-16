const fs = require('fs');
const proj4 = require('proj4');

// Define the ETRS-GK25 projection
const etrsGK25Projection = "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";
// WGS84 projection
const wgs84Projection = "EPSG:4326";

// Function to convert coordinates
const convertCoordinate = (coordinate) => {
    let converted = proj4(etrsGK25Projection, wgs84Projection, coordinate);
    return [converted[1], converted[0]]; // Leaflet uses [latitude, longitude]
};

// Function to process each geometry's coordinates
const processGeometry = (geometry) => {
    if (geometry.type === 'Point') {
        geometry.coordinates = convertCoordinate(geometry.coordinates);
    } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
        geometry.coordinates = geometry.coordinates.map(coord => convertCoordinate(coord));
    } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
        geometry.coordinates = geometry.coordinates.map(ring => ring.map(coord => convertCoordinate(coord)));
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates = geometry.coordinates.map(polygon => polygon.map(ring => ring.map(coord => convertCoordinate(coord))));
    }
    // Add more geometry types if needed
};

// Read dataset.json
const rawData = fs.readFileSync('datasetespoo.json');
const dataset = JSON.parse(rawData);

// Convert coordinates for each feature
//dataset.features.forEach(feature => {
  //  processGeometry(feature.geometry);
//});

dataset.ResultArray.forEach((geoJSONArr) => {
    // Iterate through geoJSON objects within the array
    geoJSONArr.forEach((geoJSONObj) => {
        if (geoJSONObj.geoJSON) {
            geoJSONObj.geoJSON.forEach((item) => {
                if (item.geometry && item.geometry.members) {
                    // Assuming that 'members' is an array of geometries
                    item.geometry.members.forEach((member) => {
                        processGeometry(member.geometry);
                    });
                }
            });
        }
    });
});


// Write the converted data to a new file
const convertedData = JSON.stringify(dataset, null, 2);
fs.writeFileSync('convertedDataset.json', convertedData);
console.log('Conversion complete. File saved as convertedDataset.json');
