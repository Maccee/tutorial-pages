const fs = require("fs");

// Function to transform the custom JSON to standard GeoJSON, keeping only Polygon geometries
const transformToGeoJSON = (data) => {
  let features = [];

  data.ResultArray.forEach((item) => {
    item.forEach((geoItem) => {
      if (geoItem.geoJSON && geoItem.geoJSON.length > 0) {
        geoItem.geoJSON.forEach((geoJSONItem) => {
          if (geoJSONItem.geometry && geoJSONItem.geometry.members) {
            geoJSONItem.geometry.members.forEach((member) => {
              if (member.geometry.type === "Polygon") {
                features.push({
                  type: "Feature",
                  properties: geoJSONItem.addattrs.reduce((props, attr) => {
                    props[attr.n] = attr.v;
                    return props;
                  }, {}),
                  geometry: member.geometry,
                });
              }
            });
          }
        });
      }
    });
  });

  return {
    type: "FeatureCollection",
    features: features,
  };
};

// Read the original JSON file
fs.readFile("aluejakoEspoo.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const originalData = JSON.parse(data);
  const geoJSONData = transformToGeoJSON(originalData);

  // Write the transformed data to a new GeoJSON file
  fs.writeFile(
    "output_geojson_file.json",
    JSON.stringify(geoJSONData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("GeoJSON file has been created.");
    }
  );
});
