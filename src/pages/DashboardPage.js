import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // Sample patient data
  const patients = [
    { id: 1, name: "Rachel Tan", nric: "S1234567A", age: 72, gender: "Female" },
    { id: 2, name: "Michael Low", nric: "S2345678B", age: 68, gender: "Male" },
    { id: 3, name: "Joan Chai", nric: "S3456789C", age: 84, gender: "Female" },
    { id: 4, name: "Vikram Kannan", nric: "S4567890D", age: 77, gender: "Male" },
    { id: 5, name: "Fairuz Abdul", nric: "S5678901E", age: 70, gender: "Male" },
  ];

  const handlePatientSelect = (patient) => {
    // Store selected patient in session storage to access on profile page
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    navigate(`/patient/${patient.id}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CGA Clarity Dashboard</h1>
      </header>
      
      <main className="dashboard-main">
        <h2>Patient List</h2>
        
        {/* Table view for larger screens */}
        <div className="patient-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>NRIC</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.nric}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <button 
                      className="select-button"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Card view for mobile */}
        <div className="patient-cards">
          {patients.map(patient => (
            <div key={patient.id} className="patient-card">
              <div className="patient-card-header">
                {patient.name}
              </div>
              <div className="patient-card-details">
                <div className="patient-card-detail">
                  <span className="detail-label">NRIC</span>
                  <span className="detail-value">{patient.nric}</span>
                </div>
                <div className="patient-card-detail">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{patient.age}</span>
                </div>
                <div className="patient-card-detail">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{patient.gender}</span>
                </div>
              </div>
              <div className="patient-card-actions">
                <button 
                  className="select-button"
                  onClick={() => handlePatientSelect(patient)}
                >
                  Select Patient
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;