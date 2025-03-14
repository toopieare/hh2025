import React from 'react';

const QuestionDisplay = ({ question, isListening }) => {
  return (
    <div className="question-display">
      <h3>Current Question:</h3>
      <div className="question-text">
        {question || "Assessment complete"}
        {isListening && <span className="mic-indicator active"></span>}
      </div>
    </div>
  );
};

export default QuestionDisplay;