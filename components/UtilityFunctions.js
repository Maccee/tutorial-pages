// login visibility, from a button in header
export const toggleLoginVisibility = (isModalVisible, setIsModalVisible) => {
  setIsModalVisible(!isModalVisible);
};

// map visibility, from a button in header and under the map container
export const toggleMapVisibility = (
  isMapVisible,
  setIsMapVisible,
  setMapContainerHeight
) => {
  setIsMapVisible(!isMapVisible);
  if (!isMapVisible) {
    setMapContainerHeight(300);
  } else {
    setMapContainerHeight(0);
  }
};

// adjustments visibility, from a button in headers search bar
export const toggleAdjustmentsVisibility = (
  isAdjustmentsVisible,
  setIsAdjustmentsVisible
) => {
  console.log("toggle adjustments");
  setIsAdjustmentsVisible(!isAdjustmentsVisible);
};
