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
    if (geometry.type === 'Polygon') {
        geometry.coordinates = geometry.coordinates.map(ring => ring.map(coord => convertCoordinate(coord)));
    } else if (geometry.type === 'Point') {
        geometry.coordinates = convertCoordinate(geometry.coordinates);
    }
    // Add more geometry types if needed
};

try {
    // Read dataespoo.json
    const rawData = fs.readFileSync('datasetespoo.json');
    const data = JSON.parse(rawData);

    // Extract the relevant data array
    const resultArray = data.ResultArray;

    // Check if resultArray exists and is an array before processing
    if (Array.isArray(resultArray)) {
        // Iterate through the data array and convert coordinates
        resultArray.forEach(item => {
            const geometries = item.geoJSON;
            // Check if geometries exists and is an array before processing
            if (Array.isArray(geometries)) {
                geometries.forEach(geo => {
                    processGeometry(geo.geometry);
                });
            } else {
                console.error('Geometries is not an array:', geometries);
            }
        });

        // Write the converted data to a new file
        const convertedData = JSON.stringify(data, null, 2);
        fs.writeFileSync('convertedDataespoo.json', convertedData);
        console.log('Conversion complete. File saved as convertedDataespoo.json');
    } else {
        console.error('ResultArray is not an array:', resultArray);
    }
} catch (error) {
    console.error('Error:', error);
}
