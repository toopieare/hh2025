import React from 'react';

const QADisplay = ({ responses }) => {
  // If no responses, don't show anything
  if (!responses || Object.keys(responses).length === 0) {
    return null;
  }

  return (
    <div className="qa-display">
      <h3>Q&A History:</h3>
      <table className="qa-table">
        <tbody>
          {Object.entries(responses).map(([question, response], index) => (
            <tr key={index}>
              <td>{question}</td>
              <td>{response}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QADisplay;