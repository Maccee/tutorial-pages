// Throttle function to limit the rate at which a function is executed
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// login visibility, from a button in header
export const toggleLoginVisibility = (isLoginVisible, setIsLoginVisible) => {
  console.log("toggle login");
  setIsLoginVisible(!isLoginVisible);
};

// map visibility, from a button in header
export const toggleMapVisibility = (isMapVisible, setIsMapVisible, setMapContainerHeight) => {
  setIsMapVisible(!isMapVisible);
  if (!isMapVisible) {
    setMapContainerHeight(300);
  } else {
    setMapContainerHeight(0);
  }
};
