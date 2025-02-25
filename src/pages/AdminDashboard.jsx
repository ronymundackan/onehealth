import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState({
    name: '',
    location: '',
    contact: '',
    email: '',
    password: '',
  });
  const [selectedHospital, setSelectedHospital] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/hospitals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
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
      await axios.post('http://localhost:5000/hospitals', newHospital, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchHospitals();
      setNewHospital({ name: '', location: '', contact: '', email: '', password: '' });
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
      await axios.put(
        `http://localhost:5000/hospitals/${selectedHospital.hospital_id}`,
        newHospital,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchHospitals();
      setSelectedHospital(null);
      setNewHospital({ name: '', location: '', contact: '', email: '', password: '' });
    } catch (error) {
      console.error('Error updating hospital:', error);
    }
  };

  const deleteHospital = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/hospitals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Admin Dashboard - Manage Hospitals</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
  
      <div className="form-container">
        <h2>Add/Update Hospital</h2>
        <div className="form-row">
          <input name="name" placeholder="Name" value={newHospital.name} onChange={handleInputChange} />
          <input name="location" placeholder="Location" value={newHospital.location} onChange={handleInputChange} />
          <input name="contact" placeholder="Contact" value={newHospital.contact} onChange={handleInputChange} />
          <input name="email" placeholder="Email" value={newHospital.email} onChange={handleInputChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={newHospital.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="btn-container">
          {selectedHospital ? (
            <button className="update-btn" onClick={updateHospital}>Update Hospital</button>
          ) : (
            <button className="add-btn" onClick={addHospital}>Add Hospital</button>
          )}
          {selectedHospital && <button className="cancel-btn" onClick={() => setSelectedHospital(null)}>Cancel</button>}
        </div>
      </div>
  
      <div className="hospitals-list">
        <h2>Hospitals</h2>
        <ul>
          {hospitals.map((hospital) => (
            <li key={hospital.hospital_id} className="hospital-item">
              <div className="hospital-info">
                {hospital.name} - {hospital.location} - {hospital.contact}
              </div>
              <div className="hospital-actions">
                <button className="edit-btn" onClick={() => selectHospital(hospital)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteHospital(hospital.hospital_id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;