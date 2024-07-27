// src/components/CompleteRegistration.jsx

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { completeRegistration } from '../api/auth';

const CompleteRegistration = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = searchParams.get('token');
    try {
      await completeRegistration(token, username, password);
      setError('');
      navigate('/signin');
    } catch (error) {
      setError('Failed to complete registration. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <h2>Complete Registration</h2>
      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
};

export default CompleteRegistration;
