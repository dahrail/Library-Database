import React from "react";

const Media = ({ mediaItems, handleReturn }) => {
  return (
    <div className="content-container">
      <h2>Media Collection</h2>
      <div className="media-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="media-item">
            <img
              src={`/images/media/${item.id}.jpg`}
              alt={item.title}
              className="media-image"
            />
            <h3>{item.title}</h3>
            <p>Genre: {item.genre}</p>
            {item.isLoaned && (
              <button onClick={() => handleReturn(item)} className="btn-return">
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
