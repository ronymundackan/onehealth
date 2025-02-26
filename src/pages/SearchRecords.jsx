import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HospitalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    disease: '',
    description: '',
    treatment_date: '',
    ongoing_medication: '',
    prescription: '',
  });
  const [editingRecordId, setEditingRecordId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/records/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleViewRecords = async (patientId) => {
    try {
      setSelectedPatient(patientId);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/records/records/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleAddRecord = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/records/records/${selectedPatient}`,
        newRecord,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleViewRecords(selectedPatient);
      setNewRecord({
        disease: '',
        description: '',
        treatment_date: '',
        ongoing_medication: '',
        prescription: '',
      });
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const handleEditRecord = (recordId) => {
    setEditingRecordId(recordId);
    const recordToEdit = records.find((record) => record.record_id === recordId);
    setNewRecord(recordToEdit);
  };

  const handleUpdateRecord = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/records/records/${editingRecordId}`,
        newRecord,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleViewRecords(selectedPatient);
      setEditingRecordId(null);
      setNewRecord({
        disease: '',
        description: '',
        treatment_date: '',
        ongoing_medication: '',
        prescription: '',
      });
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  return (
    <div>
      <h2>Medical Records</h2>
      <div>
        <h3>Patients</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.user_id}>
                <td>{patient.name}</td>
                <td>{patient.phone_number}</td>
                <td>
                  <button onClick={() => handleViewRecords(patient.user_id)}>
                    View Records
                  </button>
                  <button onClick={() => setSelectedPatient(patient.user_id)}>
                    Add Record
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPatient && (
        <div>
          <h3>Medical Records</h3>
          {records.map((record) => (
            <div key={record.record_id}>
              {editingRecordId === record.record_id ? (
                <div>
                  <input
                    type="text"
                    value={newRecord.disease}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, disease: e.target.value })
                    }
                  />
                  {/* Add other editable fields */}
                  <button onClick={handleUpdateRecord}>Save</button>
                  <button onClick={() => setEditingRecordId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  {record.disease} - {record.description}
                  <button onClick={() => handleEditRecord(record.record_id)}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
          <div>
            <input
              type="text"
              placeholder="Disease"
              value={newRecord.disease}
              onChange={(e) =>
                setNewRecord({ ...newRecord, disease: e.target.value })
              }
            />
            {/* Add other input fields */}
            <button onClick={handleAddRecord}>Add Record</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalRecords;