// login visibility, from a button in header
export const toggleLoginVisibility = (isModalVisible, setIsModalVisible) => {

  console.log("toggle login", isModalVisible);

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

export const toggleAdjustmentsVisibility = (
  isAdjustmentsVisible,
  setIsAdjustmentsVisible
) => {
  console.log("toggle adjustments");
  setIsAdjustmentsVisible(!isAdjustmentsVisible);
};
