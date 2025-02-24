// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState({ name: '', location: '', contact: ''});
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/hospitals', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewHospital({ ...newHospital, [e.target.name]: e.target.value });
  };

  const addHospital = async () => {
    try {
      await axios.post('http://localhost:5000/hospitals', newHospital, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchHospitals();
      setNewHospital({ name: '', location: '', contact: ''});
    } catch (error) {
      console.error('Error adding hospital:', error);
    }
  };

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setNewHospital({ ...hospital });
  };

  const updateHospital = async () => {
    try {
      await axios.put(`http://localhost:5000/hospitals/${selectedHospital.hospital_id}`, newHospital, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchHospitals();
      setSelectedHospital(null);
      setNewHospital({ name: '', location: '', contact: ''});
    } catch (error) {
      console.error('Error updating hospital:', error);
    }
  };

  const deleteHospital = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/hospitals/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard - Manage Hospitals</h1>

      <div>
        <h2>Add/Update Hospital</h2>
        <input name="name" placeholder="Name" value={newHospital.name} onChange={handleInputChange} />
        <input name="location" placeholder="Location" value={newHospital.location} onChange={handleInputChange} />
        <input name="contact" placeholder="Contact" value={newHospital.contact} onChange={handleInputChange} />
        {selectedHospital ? (
          <button onClick={updateHospital}>Update Hospital</button>
        ) : (
          <button onClick={addHospital}>Add Hospital</button>
        )}
        {selectedHospital && <button onClick={() => setSelectedHospital(null)}>Cancel</button>}
      </div>

      <div>
        <h2>Hospitals</h2>
        <ul>
          {hospitals.map((hospital) => (
            <li key={hospital.hospital_id}>
              {hospital.name} - {hospital.location} - {hospital.contact}
              <button onClick={() => selectHospital(hospital)}>Edit</button>
              <button onClick={() => deleteHospital(hospital.hospital_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;