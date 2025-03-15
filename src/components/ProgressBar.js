import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, labels = [] }) => {
  const progress = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        >
          <span className="progress-text">{current}/{total}</span>
        </div>
      </div>
      
      {labels.length > 0 && (
        <div className="progress-labels">
          {labels.map((label, index) => (
            <div 
              key={index} 
              className={`progress-label ${index < current ? 'completed' : ''} ${index === current ? 'active' : ''}`}
              style={{ left: `${(index / (total - 1)) * 100}%` }}
            >
              <div className="progress-dot"></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;