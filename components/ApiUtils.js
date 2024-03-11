// Function to fetch data
export async function fetchData(
  url,
  accumulatedMarkers = [],
  progressCallback
) {
  try {
    // Fetch data
    const response = await fetch(url);
    const result = await response.json();

    // track progressbar
    let totalItems = result.data.length;
    let itemsProcessed = 0;

    const newMarkers = await Promise.all(
      result.data
        // Filter out items without coordinates or starting with osoite and harrastus
        .filter((item) => item.position && item.position.coordinates)
        .filter((item) => !item.id.startsWith("osoite"))
        .filter((item) => !item.id.startsWith("harrastus"))

        // for every result check for images and build marker object
        .map(async (item) => {
          let imageUrl = "";
          // Fetch image URL
          if (item.image) {
            imageUrl = await getImage(item.image);
          }
          // Fetch additional image
          if (!imageUrl) {
            const imageResponse = await fetch(
              `https://api.hel.fi/linkedevents/v1/image/?text=${item.name.fi}`
            );
            const imageResult = await imageResponse.json();

            if (imageResult.data.length > 0) {
              imageUrl = imageResult.data[0].url;
            }
          }


          // Update progressbar
          itemsProcessed += 1;
          const progress =
            totalItems > 0 ? (itemsProcessed / totalItems) * 100 : 0;
          if (typeof progressCallback === "function") {
            progressCallback(progress);
          }


          // Construct marker object
          return {
            id: item.id,
            name: item.name.fi,
            description: item.description?.fi,
            imageUrl,
            www: item.info_url?.fi,
            coordinates: item.position.coordinates,
          };
        })
    );

    // Combine accumulated markers with new ones
    const updatedMarkers = [...accumulatedMarkers, ...newMarkers];

    // SORTER to sort the markers to image and description first.
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

    // Continue fetching more data recursively if there's more data to fetch
    if (result.meta.next) {
      return fetchData(result.meta.next, sortedMarkers);
    } else {
      // End of data, return the sorted markers
      return sortedMarkers;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return the accumulated markers so far in case of an error
    return accumulatedMarkers;
  }
}

// Function to fetch image URL based on image ID
export async function getImage(imageId) {
  try {
    // Fetch image data from the provided image ID
    const response = await fetch(
      `https://api.hel.fi/linkedevents/v1/image/${imageId}`
    );
    const imageData = await response.json();
    // Return the URL of the image
    return imageData.url;
  } catch (error) {
    console.error("Error fetching image:", error);
    // Return an empty string in case of an error
    return "";
  }
}
