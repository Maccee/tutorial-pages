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
          // Fetch additional image if necessary
          if (!imageUrl) {
            const imageResponse = await fetch(
              `https://api.hel.fi/linkedevents/v1/image/?text=${item.name.fi}`
            );
            const imageResult = await imageResponse.json();

            if (imageResult.data.length > 0) {
              imageUrl = imageResult.data[0].url;
            }
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

    const sortedMarkers = updatedMarkers.sort((a, b) => {
      // Check if both items have image and description
      const aHasImageAndDescription = a.imageUrl && a.description;
      const bHasImageAndDescription = b.imageUrl && b.description;

      // Check if both items have image (but not description)
      const aHasImage = a.imageUrl && !aHasImageAndDescription;
      const bHasImage = b.imageUrl && !bHasImageAndDescription;

      if (aHasImageAndDescription && bHasImageAndDescription) {
        // Both have image and description, no change in order
        return 0;
      } else if (aHasImageAndDescription) {
        // Only 'a' has image and description, move it up
        return -1;
      } else if (bHasImageAndDescription) {
        // Only 'b' has image and description, move it up
        return 1;
      } else if (aHasImage && bHasImage) {
        // Both have image (but not description), no change in order
        return 0;
      } else if (aHasImage) {
        // Only 'a' has image, move it up
        return -1;
      } else if (bHasImage) {
        // Only 'b' has image, move it up
        return 1;
      } else {
        // None have image or description, no change in order
        return 0;
      }
    });

    // Stop fetching if the limit is reached or exceeded and return the sorted markers
    if (sortedMarkers.length >= 50) {
      return sortedMarkers.slice(0, 50);
    }

    if (result.meta.next) {
      // Continue fetching more data recursively
      return fetchData(result.meta.next, sortedMarkers);
    } else {
      // End of data, return the sorted markers
      return sortedMarkers;
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
    console.log("original image found", imageId);
    return imageData.url;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
}
