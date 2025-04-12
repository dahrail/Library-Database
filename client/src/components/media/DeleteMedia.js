import React from 'react';
import "../../styles/media/media.css";

const DeleteMedia = ({ mediaData, onDeleteMedia, navigateToHome}) => {
  const handleConfirmDelete = () => {
    onDeleteMedia(mediaData.MediaID);
  };

  const handleDelete = () => {
    onDeleteMedia(mediaData.MediaID);
  };

  return (
    <div className="content-container">
      <h2>Confirm Delete Media</h2>
      <div className="media-details">
        <p><strong>Type:</strong> {mediaData.Type}</p>
        <p><strong>Title:</strong> {mediaData.Title}</p>
        <p><strong>Author:</strong> {mediaData.Author}</p>
        <p><strong>Genre:</strong> {mediaData.Genre}</p>
        <p><strong>Publication Year:</strong> {mediaData.PublicationYear}</p>
        <p><strong>Language:</strong> {mediaData.Language}</p>
        <p><strong>Total Copies:</strong> {mediaData.TotalCopies}</p>
        <p><strong>Available Copies:</strong> {mediaData.AvailableCopies}</p>
      </div>

      <div className="button-group">
        <button onClick={navigateToHome} className="btn-secondary">Cancel</button>
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default DeleteMedia;
