import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const HoldList = ({ user }) => {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolds = async () => {
      if (!user || !user.UserID) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/holds/${user.UserID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch holds');
        }
        const data = await response.json();
        
        if (data.success) {
          setHolds(data.holds);
        } else {
          throw new Error(data.error || 'Failed to fetch holds');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHolds();
  }, [user]);

  if (loading) return <div className="loading">Loading holds...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="hold-list-container">
      <h2>My Hold Requests</h2>
      
      {holds.length === 0 ? (
        <p className="no-holds">You don't have any active hold requests.</p>
      ) : (
        <div className="hold-cards">
          {holds.map((hold, index) => (
            <div key={index} className="hold-card">
              <h4>{hold.Title}</h4>
              <p><strong>Author:</strong> {hold.Author}</p>
              <p><strong>Requested On:</strong> {formatDate(hold.RequestAT)}</p>
              <p><strong>Status:</strong> <span className="hold-status">{hold.HoldStatus}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HoldList;
