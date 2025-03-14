import React from 'react';

const SummaryDisplay = ({ summary, isComplete }) => {
  return (
    <div className="summary-container">
      <h3>Assessment Summary:</h3>
      <div className="summary-content">
        {isComplete ? (
          <pre>{summary}</pre>
        ) : (
          <p>Assessment in progress or not started yet.</p>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;