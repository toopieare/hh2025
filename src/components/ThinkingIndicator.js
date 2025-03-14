import React from 'react';
import './ThinkingIndicator.css';

const ThinkingIndicator = ({ message }) => {
  return (
    <div className="thinking-indicator">
      <div className="thinking-animation">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p className="thinking-message">{message || "Processing..."}</p>
    </div>
  );
};

export default ThinkingIndicator;