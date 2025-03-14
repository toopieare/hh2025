import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentContainer from '../containers/AssessmentContainer';
import './PatientProfile.css';

const PatientProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  
  useEffect(() => {
    // Get patient data from session storage
    const storedPatient = sessionStorage.getItem('selectedPatient');
    
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    } else {
      // If no patient in storage, redirect back to dashboard
      navigate('/');
    }
  }, [id, navigate]);
  
  if (!patient) {
    return <div className="loading">Loading patient data...</div>;
  }
  
  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate('/')}>
          &larr; Back to Dashboard
        </button>
        <h1>Patient Profile</h1>
      </header>
      
      <div className="patient-card">
        <div className="patient-info">
          <h2>{patient.name}</h2>
          <div className="patient-details">
            <div className="detail-item">
              <span className="label">NRIC:</span>
              <span className="value">{patient.nric}</span>
            </div>
            <div className="detail-item">
              <span className="label">Age:</span>
              <span className="value">{patient.age}</span>
            </div>
            <div className="detail-item">
              <span className="label">Gender:</span>
              <span className="value">{patient.gender}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="assessment-section">
        <AssessmentContainer patientName={patient.name} />
      </div>
    </div>
  );
};

export default PatientProfilePage;