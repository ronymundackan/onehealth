import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MedicalRecords.css'; // Import the new CSS file

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/records', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setRecords([]);
    }
  };

  return (
    <div className="medical-records-container">
      <h3>Medical Records</h3>
      {records.length > 0 ? (
        <table className="medical-records-table">
          <thead>
            <tr>
              <th>Disease</th>
              <th>Description</th>
              <th>Treatment Date</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.record_id}>
                <td>{record.disease}</td>
                <td>{record.description}</td>
                <td>{new Date(record.treatment_date).toLocaleDateString()}</td>
                <td>{record.prescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No medical records found.</p>
      )}
    </div>
  );
};

export default MedicalRecords;
