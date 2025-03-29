import React, { useState } from 'react';
import '../../styles/auth/Auth.css';

const PasscodeModal = ({ isOpen, onClose, onSubmit }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (passcode === '123456') { // Example passcode
      setError('');
      onSubmit();
    } else {
      setError('Invalid passcode. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="passcode-modal-overlay">
      <div className="passcode-modal">
        <h2 className="passcode-modal-title">Faculty Verification</h2>
        <p className="passcode-modal-subtitle">Please enter the faculty passcode to continue</p>
        
        <div className="passcode-input-container">
          <input
            type="password"
            className="passcode-input"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
          />
          {error && <p className="passcode-error">{error}</p>}
        </div>
        
        <div className="passcode-modal-buttons">
          <button 
            className="passcode-button passcode-button-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="passcode-button passcode-button-submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasscodeModal;
