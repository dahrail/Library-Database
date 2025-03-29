import React from "react";

const Electronics = ({ navigateToHome }) => {
  return (
    <div className="content-container">
      <h2>Electronics Collection</h2>
      <p>Explore our collection of electronics!</p>
      <button onClick={navigateToHome} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default Electronics;
