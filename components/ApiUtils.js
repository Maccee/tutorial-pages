import paikat from "../public/paikat.json";

export const selectAndFetch = async () => {
  // Reset markers at the beginning
  const allPlaces = paikat.places; // Your array of places from the JSON file
  let selectedPlaces = [];
  let selectedNames = new Set(); // Set to keep track of selected place names

  // Randomly select places without duplicates
  while (selectedPlaces.length < 20) {
    const randomIndex = Math.floor(Math.random() * allPlaces.length);
    const placeName = allPlaces[randomIndex];

    if (!selectedNames.has(placeName)) {
      selectedPlaces.push(placeName);
      selectedNames.add(placeName); // Add the name to the Set
    }
  }
  console.log(selectedPlaces);

  let newMarkers = []; // Temporary array to hold new markers

  for (const place of selectedPlaces) {
    const url = `https://api.hel.fi/linkedevents/v1/search/?type=place&q=${place}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(place, result);

      // Access the first item in the data array
      let item = result.data[0];

      // Use data[1] if the name starts with "äänestys"
      if (
        (item && item.name.fi.startsWith("Äänestys")) ||
        item.name.fi.startsWith("EuroPark") ||
        (item.name.fi.startsWith("Pysäköinti") && result.data.length > 1)
      ) {
        item = result.data[1];
      }

      // Check if the item meets the required conditions
      if (
        item &&
        item.position &&
        item.position.coordinates &&
        !item.id.startsWith("osoite") &&
        !item.id.startsWith("harrastus")
      ) {
        let imageUrl;
        if (item.image) {
          imageUrl = await getImage(item.image);
        }

        // Fetch additional image if necessary
        if (!imageUrl) {
          const imageResponse = await fetch(
            `https://api.hel.fi/linkedevents/v1/image/?text=${place}`
          );
          const imageResult = await imageResponse.json();

          if (imageResult.data.length > 0) {
            imageUrl = imageResult.data[0].url;
          } else {
            continue; // Skip if no image is found
          }
        }

        // Create a marker object
        const marker = {
          id: item.id,
          name: item.name.fi,
          description: item.description?.fi
            ? (item.description.fi.match(/^[^,.]*/) || [])[0] + "."
            : "",
          imageUrl,
          www: item.info_url?.fi,
          coordinates: item.position.coordinates,
        };

        newMarkers.push(marker); // Add marker to temporary array
      }
    } catch (error) {
      console.error("Error fetching data for place:", place, error);
      // Optionally, handle the error
    }
  }

  // Update markers state in one go
  return newMarkers;
};

export async function fetchData(url, accumulatedMarkers = []) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    const newMarkers = await Promise.all(
      result.data
        .filter((item) => item.position && item.position.coordinates)
        .filter((item) => !item.id.startsWith("osoite"))
        .filter((item) => !item.id.startsWith("harrastus"))
        .map(async (item) => {
          let imageUrl = "";
          if (item.image) {
            imageUrl = await getImage(item.image);
          }
          return {
            id: item.id,
            name: item.name.fi,
            description: item.description?.fi
              ? (item.description.fi.match(/^[^,.]*/) || [])[0] + "."
              : "",
            imageUrl,
            www: item.info_url?.fi,
            coordinates: item.position.coordinates,
          };
        })
    );
    console.log(result.data);
    const updatedMarkers = [...accumulatedMarkers, ...newMarkers];

    // Stop fetching if the limit is reached or exceeded and return the markers
    if (updatedMarkers.length >= 50) {
      return updatedMarkers.slice(0, 50);
    }

    if (result.meta.next) {
      // Continue fetching more data recursively
      return fetchData(result.meta.next, updatedMarkers);
    } else {
      // End of data, return the accumulated markers
      return updatedMarkers;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return accumulatedMarkers; // Return the accumulated markers so far in case of an error
  }
}

export async function getImage(imageId) {
  try {
    const response = await fetch(
      `https://api.hel.fi/linkedevents/v1/image/${imageId}`
    );
    const imageData = await response.json();
    return imageData.url;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
}
