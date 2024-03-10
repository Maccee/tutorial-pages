import React from 'react';

function Modal({ isVisible, children, onClose }) {
  if (!isVisible) return null;

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Убедитесь, что модальное окно будет над другими элементами
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginTop: '10px',
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {children}
        <button style={buttonStyle} onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default Modal;
