import React, { useState, useEffect } from 'react';
import "../../styles/media/media.css";

const UpdateMedia = ({ mediaData, onUpdateMedia, navigateToHome }) => {
  const [media, setMedia] = useState({
    MediaID: '',
    Type: '',
    Title: '',
    Author: '',
    Genre: '',
    PublicationYear: '',
    Language: '',
    TotalCopies: '',
    AvailableCopies: '',
  });

  useEffect(() => {
    if (mediaData) {
      setMedia(mediaData); // Pre-fill form with existing data
    }
  }, [mediaData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedia(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateMedia(media); // Send updated media data to parent
  };

  return (
    <div className="content-container">
      <h2>Update Media</h2>
      <form onSubmit={handleSubmit} className="add-media-form">
        <div className="form-row">
          <div className="form-group">
            <label>Type:</label>
            <select
              name="Type"
              value={media.Type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Movie">Movies</option>
              <option value="Music">Music</option>
              <option value="Videogame">Video games</option>
            </select>
          </div>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="Title"
              value={media.Title}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Author:</label>
            <input
              type="text"
              name="Author"
              value={media.Author}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <input
              type="text"
              name="Genre"
              value={media.Genre}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>PublicationYear:</label>
            <input
              type="text"
              name="PublicationYear"
              value={media.PublicationYear}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Language:</label>
            <input
              type="text"
              name="Language"
              value={media.Language}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Copies:</label>
            <input
              type="number"
              name="TotalCopies"
              value={media.TotalCopies}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Available Copies:</label>
            <input
              type="number"
              name="AvailableCopies"
              value={media.AvailableCopies}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={navigateToHome} className="btn-secondary">Back</button>
          <button type="submit" className="btn-primary">Update Media</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMedia;
