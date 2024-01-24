const fs = require("fs");
const turf = require("@turf/turf");

const readGeoJSON = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

const writeGeoJSON = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const findKauniainen = (espooData) => {
  if (!espooData || !espooData.features) {
    console.error("Invalid GeoJSON data");
    return null;
  }
  for (let i = 0; i < espooData.features.length; i++) {
    let outerFeature = espooData.features[i];
    if (outerFeature.geometry.type !== "Polygon") continue;

    let isKauniainen = true;
    for (let j = 0; j < espooData.features.length; j++) {
      if (i === j) continue;

      let innerFeature = espooData.features[j];
      if (innerFeature.geometry.type !== "Polygon") continue;

      if (turf.booleanContains(outerFeature, innerFeature)) {
        isKauniainen = false;
        break;
      }
    }

    if (isKauniainen) {
      return {
        type: "FeatureCollection",
        features: [outerFeature],
      };
    }
  }

  return null; // Kauniainen not found
};

const main = async () => {
  try {
    const espooData = await readGeoJSON("aluejakoEspoocopy.json");
    console.log("Espoo Data Loaded:", espooData);
    const kauniainenGeoJSON = findKauniainen(espooData);

    if (kauniainenGeoJSON) {
      await writeGeoJSON("aluejakoKauniainen.json", kauniainenGeoJSON);
      console.log("Kauniainen GeoJSON file has been created.");
    } else {
      console.log("Kauniainen was not found in the provided data.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
