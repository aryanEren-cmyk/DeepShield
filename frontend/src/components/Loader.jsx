import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <style>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(0, 245, 160, 0.2);
          border-top-color: #00f5a0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
