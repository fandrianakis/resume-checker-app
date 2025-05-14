import React from 'react';
import './AnchorLoader.css';

const AnchorLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="anchor-wrapper">
          <svg
            className="anchor-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 22a2 2 0 0 0 2-2c0-.74-.4-1.39-1-1.73V17h1a7 7 0 0 0 7-7h-2c0 2.76-2.24 5-5 5h-1V5.28c1.17-.41 2-1.52 2-2.82 0-1.66-1.34-3-3-3s-3 1.34-3 3c0 1.3.83 2.41 2 2.82V15h-1c-2.76 0-5-2.24-5-5H3c0 3.87 3.13 7 7 7h1v1.27c-.6.34-1 .99-1 1.73a2 2 0 0 0 2 2m-4.85-8.15L8.56 8.74 12 12.17l3.44-3.43 1.41 1.41L12 15l-4.85-4.85Z"
              fill="currentColor"
            />
          </svg>
          <div className="waves">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
        <div className="loader-text">
          Γίνεται ανάλυση του βιογραφικού...
        </div>
      </div>
    </div>
  );
};

export default AnchorLoader; 