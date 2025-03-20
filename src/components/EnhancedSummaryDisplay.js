import React from 'react';
import './EnhancedSummary.css';

const EnhancedSummaryDisplay = ({ summary, isComplete }) => {
  if (!isComplete || !summary) {
    return null;
  }
  
  // Parse summary data with more sophisticated regex to handle the enhanced clinical output
  // This pattern looks for fall history section
  const fallsMatch = summary.match(/Falls history:([^]*?)(?=Cognitive history:|$)/i);
  // This pattern looks for cognitive history section
  const cognitiveMatch = summary.match(/Cognitive history:([^]*?)(?=$)/i);
  
  const fallsStatus = fallsMatch ? fallsMatch[1].trim() : "Unknown";
  const cognitiveStatus = cognitiveMatch ? cognitiveMatch[1].trim() : "Unknown";
  
  // Determine if there are concerns based on content
  // For falls, explicitly check for positive indications and response patterns
  const hasFallsConcern = (() => {
    // Check response data directly first
    const fallQuestion = "Did your mother have any falls recently?";
    const fallResponse = summary.includes(fallQuestion) 
      ? summary.split(fallQuestion)[1]?.split('\n')[0]?.trim() 
      : "";
    
    // Check if the response contains indicators of falls
    const fallIndicators = ["yes", "did", "week", "weeks", "ago", "fell", "had a fall", "think so", "like 2", "recently"];
    const responseSuggestsFall = fallResponse && 
                                fallIndicators.some(indicator => 
                                  fallResponse.toLowerCase().includes(indicator));
    
    // Also check the parsed falls status
    const statusIndicatesFall = fallsStatus.toLowerCase().includes('concern') && 
                               !fallsStatus.toLowerCase().includes('no concern');
                               
    // If either the raw response or summary status indicates a fall, show concern
    return responseSuggestsFall || statusIndicatesFall;
  })();
  const hasCognitiveConcern = !cognitiveStatus.toLowerCase().includes('no concerns identified');
  
  // Parse cognitive issues with better handling of clinical terminology
  let cognitiveIssues = [];
  if (hasCognitiveConcern) {
    // Split by commas, line breaks, or bullet points
    const rawIssues = cognitiveStatus.split(/[,\n]|\s*[-•]\s*/);
    // Clean up and filter empty entries
    cognitiveIssues = rawIssues
      .map(issue => issue.trim())
      .filter(issue => 
        issue && 
        !issue.toLowerCase().includes('no concerns') && 
        issue.length > 3
      );
  }

  return (
    <div className="enhanced-summary-container">
      <div className="summary-header">
        <h3>Clinical Assessment Summary</h3>
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
              {hasCognitiveConcern ? 'Clinical findings detected' : 'No concerns identified'}
            </div>
          </div>
          
          {hasCognitiveConcern && cognitiveIssues.length > 0 && (
            <div className="cognitive-issues">
              <h4>Clinical Findings:</h4>
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
            Generate Clinical Report
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