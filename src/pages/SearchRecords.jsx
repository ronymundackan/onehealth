import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/SearchRecords.css';

Modal.setAppElement('#root');

const HospitalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    disease: '',
    description: '',
    treatment_date: '',
    prescription: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        prescription: '',
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '500px',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000
    },
  };

  return (
    <div className="records-container">
      <h2 className="records-heading">Medical Records</h2>
      <div>
        <h3 className="records-subheading">Patients</h3>
        <table className="records-table">
          <thead className="records-table-head">
            <tr>
              <th className="records-table-cell">Name</th>
              <th className="records-table-cell">Phone Number</th>
              <th className="records-table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.user_id}>
                <td className="records-table-cell">{patient.name}</td>
                <td className="records-table-cell">{patient.phone_number}</td>
                <td className="records-table-cell">
                  <button
                    className="button-primary"
                    onClick={() => handleViewRecords(patient.user_id)}
                  >
                    View Records
                  </button>
                  <button
                    className="button-success"
                    onClick={() => { setSelectedPatient(patient.user_id); handleOpenModal(); }}
                  >
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
          <h3 className="records-subheading">Medical Records</h3>
          {records.length === 0 ? (
            <p className="no-records">No records found for this patient.</p>
          ) : (
            <div>
              {records.map((record) => (
                <div key={record.record_id} className="record-card">
                  <div>
                    <h4 className="record-heading">{record.disease}</h4>
                    <p className="record-property"><strong>Description:</strong> {record.description}</p>
                    <p className="record-property"><strong>Prescription:</strong> {record.prescription}</p>
                    <p className="record-property"><strong>Treatment Date:</strong> {new Date(record.treatment_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            style={customModalStyles}
            contentLabel="Add Medical Record"
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <div>
              <div className="modal-header">
                <h2 className="modal-heading">Add Medical Record</h2>
                <button
                  className="modal-close-button"
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>

              <div>
                <div>
                  <label className="modal-label" htmlFor="disease">Disease*</label>
                  <input
                    id="disease"
                    type="text"
                    placeholder="Enter disease name"
                    className="modal-input"
                    value={newRecord.disease}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, disease: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="modal-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Enter detailed description"
                    className="modal-textarea"
                    value={newRecord.description}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="modal-label" htmlFor="prescription">Prescription</label>
                  <textarea
                    id="prescription"
                    placeholder="Enter detailed prescription"
                    className="modal-textarea"
                    value={newRecord.prescription}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, prescription: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="modal-label" htmlFor="treatment_date">Treatment Date*</label>
                  <input
                    id="treatment_date"
                    type="date"
                    className="modal-input"
                    value={newRecord.treatment_date}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, treatment_date: e.target.value })
                    }
                  />
                </div>

                <div className="button-group">
                  <button
                    className="button-success full-width-button"
                    onClick={handleAddRecord}
                  >
                    Add Record
                  </button>
                  <button
                    className="button-cancel"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>  
      )}
    </div>
  );
};

export default HospitalRecords;