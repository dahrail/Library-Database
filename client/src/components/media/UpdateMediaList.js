import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import '../../styles/media/media.css';

const UpdateMediaList = ({ navigateToHome, navigateToUpdateMedia }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="content-container">
      <h2>Update Media</h2>
      {loading ? (
        <p>Loading media...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
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
            {media.map((media) => (
              <tr key={media.DeviceID}>
                <td>{media.Type}</td>
                <td>{media.Title}</td>
                <td>{media.Author}</td>
                <td>{media.Genre}</td>
                <td>{media.PublicationYear}</td>
                <td>{media.Language}</td>
                <td>{media.TotalCopies}</td>
                <td>{media.AvailableCopies}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => navigateToUpdateMedia(media)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={navigateToHome} className="btn-secondary">
        Back to Home
      </button>
    </div>
  );
};

export default UpdateMediaList;