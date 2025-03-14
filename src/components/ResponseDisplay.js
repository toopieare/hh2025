import React from 'react';

const ResponseDisplay = ({ response }) => {
  return (
    <div className="response-display">
      <h3>Last Response:</h3>
      <div className="response-text">
        {response || "No response recorded yet."}
      </div>
    </div>
  );
};

export default ResponseDisplay;