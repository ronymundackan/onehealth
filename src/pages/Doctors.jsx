import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Doctors.css'; // Make sure to create this CSS file

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    forenoon_availability: '',
    afternoon_availability: '',
  });
  const [editAvailability, setEditAvailability] = useState({
    doctorId: null,
    forenoon_availability: '',
    afternoon_availability: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);

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
  };

  const handleAddDoctor = async () => {
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
        forenoon_availability: '',
        afternoon_availability: '',
      });
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const handleEditAvailabilityClick = (doctor) => {
    setEditAvailability({
      doctorId: doctor.doctor_id,
      forenoon_availability: doctor.forenoon_availability,
      afternoon_availability: doctor.afternoon_availability,
    });
    setShowEditModal(true);
  };

  const handleAvailabilityInputChange = (e) => {
    setEditAvailability({ ...editAvailability, [e.target.name]: e.target.value });
  };

  const handleSaveAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/doctors/${editAvailability.doctorId}/availability`,
        {
          forenoon_availability: editAvailability.forenoon_availability,
          afternoon_availability: editAvailability.afternoon_availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDoctors();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <div className="doctors-container">
      <h2>Doctors</h2>

      {/* Add Doctor Form */}
      <div className="add-doctor-section">
        <h3>Add Doctor</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newDoctor.name}
          onChange={handleInputChange}
          className="doctor-input"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={handleInputChange}
          className="doctor-input"
        />
        <input
          type="text"
          name="forenoon_availability"
          placeholder="Forenoon Availability"
          value={newDoctor.forenoon_availability}
          onChange={handleInputChange}
          className="doctor-input"
        />
        <input
          type="text"
          name="afternoon_availability"
          placeholder="Afternoon Availability"
          value={newDoctor.afternoon_availability}
          onChange={handleInputChange}
          className="doctor-input"
        />
        <button onClick={handleAddDoctor} className="add-doctor-btn">Add Doctor</button>
      </div>

      {/* Doctors List */}
      <div className="doctors-table-container">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Forenoon Availability</th>
              <th>Afternoon Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctor_id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.forenoon_availability}</td>
                <td>{doctor.afternoon_availability}</td>
                <td>
                  <button 
                    onClick={() => handleEditAvailabilityClick(doctor)}
                    className="edit-btn"
                  >
                    Edit Availability
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Availability Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Availability</h3>
            <input
              type="text"
              name="forenoon_availability"
              value={editAvailability.forenoon_availability}
              onChange={handleAvailabilityInputChange}
              className="modal-input"
            />
            <input
              type="text"
              name="afternoon_availability"
              value={editAvailability.afternoon_availability}
              onChange={handleAvailabilityInputChange}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={handleSaveAvailability} className="save-btn">Save</button>
              <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;