import React from "react";

function Modal({ isVisible, children, onClose }) {
  if (!isVisible) return null;

  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    overflowY: "auto", // Added to make the backdrop scrollable
  };

  const modalStyle = {
    position: "relative", // Added to position the close button
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "80%", // Adjusted to ensure the modal is contained within the viewport height
    overflowY: "auto", // Added to make the modal content scrollable if it exceeds maxHeight
  };

  const closeButtonStyle = {
    position: "absolute",
    top: 10,
    right: 10,
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
