import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  useEffect(() => {
    if (selectedHospital) {
      fetchDoctors(selectedHospital);
    }
  }, [selectedHospital]);

  const fetchDoctors = async (hospitalId) => {
    try {
      const response = await axios.get(`http://localhost:5000/hospitals/${hospitalId}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleHospitalChange = (e) => {
    setSelectedHospital(e.target.value);
    setSelectedDoctor(''); // Reset doctor selection
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleBookAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/appointments',
        {
          doctorId: selectedDoctor,
          appointmentDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Appointment request sent successfully!');
      // Reset form fields here if needed
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to send appointment request. Please try again.');
    }
  };

  return (
    <div>
      <h2>Request Appointment</h2>
      <div>
        <label>Select Hospital:</label>
        <select value={selectedHospital} onChange={handleHospitalChange}>
          <option value="">Select a hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital.hospital_id} value={hospital.hospital_id}>
              {hospital.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Doctor:</label>
        <select value={selectedDoctor} onChange={handleDoctorChange}>
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.name} ({doctor.specialization})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Appointment Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
      </div>
      <button onClick={handleBookAppointment}>Request Appointment</button>
    </div>
  );
};

export default Appointments;