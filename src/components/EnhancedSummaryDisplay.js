import React from 'react';
import './EnhancedSummary.css';

const EnhancedSummaryDisplay = ({ summary, isComplete }) => {
  if (!isComplete || !summary) {
    return null;
  }
  
  // Parse summary data 
  const fallsMatch = summary.match(/Falls history: (.*?)\n/);
  const cognitiveMatch = summary.match(/Cognitive history: (.*?)$/);
  
  const fallsStatus = fallsMatch ? fallsMatch[1] : "Unknown";
  const cognitiveStatus = cognitiveMatch ? cognitiveMatch[1] : "Unknown";
  
  const hasFallsConcern = fallsStatus.includes("Concern");
  const hasCognitiveConcern = !cognitiveStatus.includes("No concerns");
  
  // Parse cognitive issues if any
  const cognitiveIssues = hasCognitiveConcern 
    ? cognitiveStatus.split(", ") 
    : [];

  return (
    <div className="enhanced-summary-container">
      <div className="summary-header">
        <h3>Assessment Summary</h3>
      </div>
      
      <div className="summary-content">
        <div className="summary-section">
          <div className="summary-title">Falls Risk Assessment</div>
          <div className={`status-indicator ${hasFallsConcern ? 'warning' : 'success'}`}>
            <div className="status-icon">
              {hasFallsConcern 
                ? <i className="status-icon-warning">!</i>
                : <i className="status-icon-success">✓</i>
              }
            </div>
            <div className="status-text">{fallsStatus}</div>
          </div>
        </div>
        
        <div className="summary-section">
          <div className="summary-title">Cognitive Assessment</div>
          <div className={`status-indicator ${hasCognitiveConcern ? 'warning' : 'success'}`}>
            <div className="status-icon">
              {hasCognitiveConcern 
                ? <i className="status-icon-warning">!</i>
                : <i className="status-icon-success">✓</i>
              }
            </div>
            <div className="status-text">
              {hasCognitiveConcern ? 'Findings detected' : 'No concerns identified'}
            </div>
          </div>
          
          {hasCognitiveConcern && (
            <div className="cognitive-issues">
              <h4>Detected Issues:</h4>
              <ul>
                {cognitiveIssues.map((issue, index) => (
                  <li key={index} className="cognitive-issue">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="summary-actions">
          <button className="summary-action-button primary">
            Generate Report
          </button>
          <button className="summary-action-button secondary">
            Schedule Follow-up
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSummaryDisplay;