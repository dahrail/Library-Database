import React, { useEffect, useState } from 'react';
import { getFines } from '../../services/fineService';

const FinesList = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const response = await getFines();
        setFines(response.data);
      } catch (err) {
        setError('Failed to fetch fines');
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Your Fines</h2>
      {fines.length === 0 ? (
        <p>No fines to display.</p>
      ) : (
        <ul>
          {fines.map((fine) => (
            <li key={fine.FineID}>
              Amount: ${fine.Amount} - Status: {fine.Status} - Issued on: {new Date(fine.IssuedDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FinesList;