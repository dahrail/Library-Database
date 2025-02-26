import React, { useEffect, useState } from 'react';
import { getHolds } from '../../services/holdService';

const HoldsList = () => {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolds = async () => {
      try {
        const response = await getHolds();
        setHolds(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHolds();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Holds</h2>
      {holds.length === 0 ? (
        <p>No holds placed.</p>
      ) : (
        <ul>
          {holds.map((hold) => (
            <li key={hold.HoldID}>
              {hold.ItemType}: {hold.ItemID} - Status: {hold.HoldStatus}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HoldsList;