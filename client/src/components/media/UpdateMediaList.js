import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import '../../styles/media/media.css';

const UpdateMediaList = ({ navigateToHome, navigateToUpdateMedia }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await API.getMedia();
        if (data.success) {
          setMedia(data.media);
        } else {
          setError(data.error || 'Failed to fetch media');
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('An error occurred while fetching media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // Static media types for filter
  const mediaTypes = ['All', 'Movie', 'Music', 'VideoGame'];

  // Extract unique genres for the dropdown, based on filtered media
  const genres = [
    'All',
    ...new Set(
      media
        .filter((item) => selectedType === 'All' || item.Type === selectedType)
        .map((item) => item.Genre)
    ),
  ];

  // Filtered media based on selectedType and selectedGenre
  const filteredMedia = media.filter((item) => {
    const typeMatch = selectedType === 'All' || item.Type === selectedType;
    const genreMatch = selectedGenre === 'All' || item.Genre === selectedGenre;
    return typeMatch && genreMatch;
  });

  return (
    <div className="content-container">
      <h2>Update Media</h2>

      {loading ? (
        <p>Loading media...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          {/* Filter by Type */}
          <div className="filter-container">
            <label htmlFor="typeFilter">Type: </label>
            <select
              id="typeFilter"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedGenre('All'); // Reset genre filter when type changes
              }}
            >
              {mediaTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Genre */}
          <div className="filter-container">
            <label htmlFor="genreFilter">Genre: </label>
            <select
              id="genreFilter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtered Table */}
          <table className="media-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Publication Year</th>
                <th>Language</th>
                <th>Total Copies</th>
                <th>Available Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.length > 0 ? (
                filteredMedia.map((mediaItem) => (
                  <tr key={mediaItem.DeviceID}>
                    <td>{mediaItem.Type}</td>
                    <td>{mediaItem.Title}</td>
                    <td>{mediaItem.Author}</td>
                    <td>{mediaItem.Genre}</td>
                    <td>{mediaItem.PublicationYear}</td>
                    <td>{mediaItem.Language}</td>
                    <td>{mediaItem.TotalCopies}</td>
                    <td>{mediaItem.AvailableCopies}</td>
                    <td>
                      <button
                        className="btn-primary"
                        onClick={() => navigateToUpdateMedia(mediaItem)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No media items found for this type and genre.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      <button onClick={navigateToHome} className="btn-secondary">
        Back to Home
      </button>
    </div>
  );
};

export default UpdateMediaList;
