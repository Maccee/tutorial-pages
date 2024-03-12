export const fetchAndSetMarkers = (
  searchKeyword,
  eventsCheck,
  distance,
  setProgress,
  setMarkers
) => {
  console.log("Verify parameters received: ", {
    searchKeyword,
    eventsCheck,
    distance,
  });

  setMarkers([]);
  setProgress(0);

  // Use fetchEventData for events, and fetchData for places
  if (eventsCheck) {
    // Assuming fetchEventData is defined elsewhere and it's adjusted as necessary
    fetchEventData(searchKeyword, setProgress, setMarkers);
  } else {
    // Existing logic for places or other data using fetchData
    let baseUrl = "https://api.hel.fi/linkedevents/v1/place/";
    let apiUrl = `${baseUrl}?text=${encodeURIComponent(
      searchKeyword
    )}&has_upcoming_event=false&show_all_places=true`;

    // fetchData function assumed to be defined elsewhere
    fetchData(apiUrl, [], setProgress, searchKeyword)
      .then((fetchedMarkers) => {
        setMarkers(fetchedMarkers);
        setProgress(0); // Indicate completion
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setProgress(0); // Reset the progress after fetch attempt
        // Optionally, handle error state here as well
      });
  }
};

// Assuming fetchEventData function is implemented as discussed
// Modified fetchEventData function
async function fetchEventData(
  searchKeyword,
  progressCallback,
  setMarkers,
  url = null,
  accumulatedMarkers = [],
  seenEvents = new Map() // Track seen events to avoid duplicates
) {
  const baseUrl = "https://api.hel.fi/linkedevents/v1/event/";
  const apiUrl =
    url || `${baseUrl}?all_ongoing_AND=${encodeURIComponent(searchKeyword)}`;

  // Start or update the progress
  progressCallback(accumulatedMarkers.length ? 50 : 0);

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    const events = result.data;

    const markers = (
      await Promise.all(
        events.map(async (event) => {
          // Skip fetching location details for already processed events
          if (seenEvents.has(event.id) || seenEvents.has(event.name.fi)) {
            return null; // Skip this event
          }

          // Mark this event as seen
          seenEvents.set(event.id, true);
          if (event.name && event.name.fi) {
            seenEvents.set(event.name.fi, true);
          }

          let locationCoordinates = null;
          if (event.location && event.location["@id"]) {
            try {
              const locationResponse = await fetch(event.location["@id"]);
              const locationData = await locationResponse.json();
              locationCoordinates =
                locationData.position && locationData.position.coordinates
                  ? locationData.position.coordinates
                  : null;
            } catch (error) {
              console.warn(
                `Failed to fetch location for event ${event.id}:`,
                error
              );
              // Proceed without location coordinates in case of an error
            }
          }

          // Return the event marker object
          return {
            id: event.id,
            locationUrl: event.location["@id"],
            offers: event.offers,
            imageUrl: event.images.length > 0 ? event.images[0].url : "",
            startTime: event.start_time,
            endTime: event.end_time,
            name: event.name.fi || event.name.en,
            shortDescription:
              event.short_description?.fi || event.short_description?.en,
            description: event.description?.fi || event.description?.en,
            infoUrl: event.info_url?.fi || event.info_url?.en,
            provider: event.provider?.fi || event.provider?.en,
            coordinates: locationCoordinates,
            apiUrl: event["@id"],
          };
        })
      )
    ).filter((marker) => marker !== null); // Filter out nulls from skipped duplicates

    // Update the accumulated markers with the new unique markers
    const newAccumulatedMarkers = [...accumulatedMarkers, ...markers];
    setMarkers(newAccumulatedMarkers);

    if (result.meta && result.meta.next) {
      // Fetch the next page if it exists
      await fetchEventData(
        searchKeyword,
        progressCallback,
        setMarkers,
        result.meta.next,
        newAccumulatedMarkers,
        seenEvents // Pass along the seenEvents map
      );
    } else {
      // Completion of the fetching process
      progressCallback(0);
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    progressCallback(0); // Indicate error or completion
  }
}

// Function to fetch data
async function fetchData(
  url,
  accumulatedMarkers = [],
  progressCallback,
  searchKeyword
) {
  try {
    const response = await fetch(url);
    const result = await response.json();
    const newMarkers = await processItems(result.data, progressCallback);
    const updatedMarkers = [...accumulatedMarkers, ...newMarkers];
    const sortedMarkers = sortMarkersKeyword(updatedMarkers, searchKeyword);

    if (sortedMarkers.length >= 100) {
      return sortedMarkers.slice(0, 100);
    }

    if (result.meta.next) {
      return fetchData(
        result.meta.next,
        sortedMarkers,
        progressCallback,
        searchKeyword
      );
    } else {
      return sortedMarkers;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return accumulatedMarkers;
  }
}

// Function to process each item and filter out osoite and harrastus before create marker objects
async function processItems(items, progressCallback) {
  let itemsProcessed = 0;
  const totalItems = items.length;

  return Promise.all(
    items
      .filter((item) => item.position && item.position.coordinates)
      .filter((item) => !item.id.startsWith("osoite"))
      .filter((item) => !item.id.startsWith("harrastus"))
      .map(async (item) => {
        const imageUrl = await fetchImageUrl(item);
        updateProgress(progressCallback, ++itemsProcessed, totalItems);
        return createMarkerObject(item, imageUrl);
      })
  );
}

// Utility function to fetch an image URL for a given item
// if the item has image property, the function calls getImage funtion to get that imageUrl and set that to the markerobject.
// if the item dont have image prop, the function uses the image api to search images for the item name.
export async function fetchImageUrl(item) {
  let imageUrl = "";
  if (item.image) {
    imageUrl = await getImage(item.image);
  }
  if (!imageUrl && item.name?.fi) {
    const response = await fetch(
      `https://api.hel.fi/linkedevents/v1/image/?text=${item.name.fi}`
    );
    const imageResult = await response.json();
    if (imageResult.data.length > 0) {
      imageUrl = imageResult.data[0].url;
    }
  }
  return imageUrl;
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

// Update progress callback
function updateProgress(progressCallback, itemsProcessed, totalItems) {
  const progress = totalItems > 0 ? (itemsProcessed / totalItems) * 100 : 0;
  if (typeof progressCallback === "function") {
    progressCallback(progress);
  }
}

// Create marker object from item and image URL
// there is alot of data in the item received from the api, i think this is the only one we need?
function createMarkerObject(item, imageUrl) {
  return {
    id: item.id,
    name: item.name.fi,
    description: item.description?.fi,
    imageUrl,
    www: item.info_url?.fi,
    coordinates: item.position.coordinates,
    apiUrl: item["@id"],
    streetAddress: item.street_address?.fi,
  };
}

// Function to sort markers by prioritizing items with the search keyword in the name,
// followed by items that have both an image and a description.
function sortMarkersKeyword(markers, searchKeyword) {
  
  return markers.sort((a, b) => {
    // Check if names contain the search keyword
    const aNameContainsKeyword = a.name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const bNameContainsKeyword = b.name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    if (aNameContainsKeyword && !bNameContainsKeyword) {
      return -1; // 'a' comes before 'b'
    } else if (!aNameContainsKeyword && bNameContainsKeyword) {
      return 1; // 'b' comes before 'a'
    } else if (aNameContainsKeyword && bNameContainsKeyword) {
      // Both contain the keyword, compare by name length next
      return a.name.length - b.name.length;
    } else {
      // Neither contains the keyword, sort by presence of image and description, and then by name length as a tiebreaker
      const aHasBoth = a.imageUrl && a.description;
      const bHasBoth = b.imageUrl && b.description;

      if (aHasBoth && !bHasBoth) {
        return -1; // 'a' comes before 'b'
      } else if (bHasBoth && !aHasBoth) {
        return 1; // 'b' comes before 'a'
      } else {
        // If both or neither have both an image and a description, sort by name length as a tiebreaker
        return a.name.length - b.name.length;
      }
    }
  });
}
