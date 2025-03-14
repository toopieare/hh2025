import React from 'react';

const SummaryDisplay = ({ summary, isComplete }) => {
  if (!isComplete) {
    return null;
  }

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h3>Assessment Summary:</h3>
      </div>
      <div className="summary-content">
        {summary ? (
          <pre>{summary}</pre>
        ) : (
          <p>No assessment data available.</p>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;