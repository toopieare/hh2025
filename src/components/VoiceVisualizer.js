import React from 'react';
import './VoiceVisualization.css';

const VoiceVisualizer = ({ isActive, statusText }) => {
  return (
    <div className={`voice-visualizer ${isActive ? 'active' : ''}`}>
      <div className="voice-bar"></div>
      <div className="voice-bar"></div>
      <div className="voice-bar"></div>
      <div className="voice-bar"></div>
      <div className="voice-bar"></div>
      <div className="voice-bar"></div>
      <div className="voice-bar"></div>
      {statusText && <span className="voice-status">{statusText}</span>}
    </div>
  );
};

export default VoiceVisualizer;