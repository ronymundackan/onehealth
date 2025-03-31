import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    phone_number: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when typing
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!newDoctor.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!newDoctor.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
      isValid = false;
    }
    if (!newDoctor.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddDoctor = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/doctors', newDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDoctors();
      setNewDoctor({
        name: '',
        specialization: '',
        phone_number: '',
      });
      setShowAddModal(false);
      setErrors({});
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div className="doctors-container">
      <h2 className="page-title">Doctors</h2>

      {/* Doctors List */}
      <div className="doctors-table-container">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctor_id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.phone_number || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <button 
        className="floating-add-btn" 
        onClick={() => setShowAddModal(true)}
        aria-label="Add Doctor"
      >
        +
      </button>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Doctor</h3>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter doctor name"
                  value={newDoctor.name}
                  onChange={handleInputChange}
                  className="modal-input"
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  type="text"
                  name="specialization"
                  placeholder="Enter specialization"
                  value={newDoctor.specialization}
                  onChange={handleInputChange}
                  className="modal-input"
                />
                {errors.specialization && <p className="error-message">{errors.specialization}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  placeholder="Enter phone number"
                  value={newDoctor.phone_number}
                  onChange={handleInputChange}
                  className="modal-input"
                />
                {errors.phone_number && <p className="error-message">{errors.phone_number}</p>}
              </div>
            </div>
            
            <div className="modal-buttons">
              <button onClick={handleAddDoctor} className="save-btn">Add Doctor</button>
              <button onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;