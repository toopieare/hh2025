import React from 'react';
import './App.css';
import AssessmentContainer from './containers/AssessmentContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Geriatric Health Assessment Tool</h1>
      </header>
      <main className="App-main">
        <AssessmentContainer />
      </main>
    </div>
  );
}

export default App;