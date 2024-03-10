// Function to fetch data
export async function fetchData(url, accumulatedMarkers = [], progressCallback, searchKeyword) {
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
      return fetchData(result.meta.next, sortedMarkers, progressCallback, searchKeyword);
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
      .filter(item => item.position && item.position.coordinates)
      .filter(item => !item.id.startsWith("osoite"))
      .filter(item => !item.id.startsWith("harrastus"))
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
async function fetchImageUrl(item) {
  let imageUrl = "";
  if (item.image) {
    imageUrl = await getImage(item.image);
  }
  if (!imageUrl && item.name?.fi) {
    const response = await fetch(`https://api.hel.fi/linkedevents/v1/image/?text=${item.name.fi}`);
    const imageResult = await response.json();
    if (imageResult.data.length > 0) {
      imageUrl = imageResult.data[0].url;
    }
  }
  return imageUrl;
}

// Function to fetch image URL based on image ID
async function getImage(imageId) {
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
  };
}


// Function to sort markers by prioritizing items with the search keyword in the name,
// followed by items that have both an image and a description.
function sortMarkersKeyword(markers, searchKeyword) {
  console.log(searchKeyword, "triggered");
  return markers.sort((a, b) => {
    // Check if names contain the search keyword
    const aNameContainsKeyword = a.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const bNameContainsKeyword = b.name.toLowerCase().includes(searchKeyword.toLowerCase());

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





export const fetchAndSetMarkers = (searchKeyword, setProgress, setMarkers) => {
  setMarkers([]);
  setProgress(0);
  const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${searchKeyword}&has_upcoming_event=false&show_all_places=true`;
  const updateProgress = (progress) => setProgress(progress);

  fetchData(initialUrl, [], updateProgress, searchKeyword)
    .then((fetchedMarkers) => {
      setMarkers(fetchedMarkers);
      setProgress(0); // Reset the progress after the fetch is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Optionally, you might want to handle error state here as well
    });
};