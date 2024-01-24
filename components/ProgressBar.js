// ProgressBar.js

import React, { useEffect, useState } from "react";

const ProgressBar = ({ totalItems, itemsProcessed }) => {
  const [progress, setProgress] = useState(0);

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
    height: "3px",
    backgroundColor: "blue", // Choose your desired color
    zIndex: 1000,

    width: `${progress}%`,
  };

  return <div style={progressBarStyles} />;
};

export default ProgressBar;
