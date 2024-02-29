import React, { useEffect, useState } from "react";

const ProgressBar = ({ totalItems, itemsProcessed }) => {
  const [progress, setProgress] = useState(0);

  // hook to keep track of procedded items/markers to set the width of the progress bar
  useEffect(() => {
    if (totalItems > 0 && itemsProcessed <= totalItems) {
      const progressPercentage = (itemsProcessed / totalItems) * 100;
      setProgress(progressPercentage);
    }
  }, [totalItems, itemsProcessed]);

  const progressBarStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "4px",
    backgroundColor: "blue",
    zIndex: 1000,

    width: `${progress}%`,
  };

  return <div style={progressBarStyles} />;
};

export default ProgressBar;
