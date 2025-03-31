import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Appointments.css";

const Appointments = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    fetchHospitals();
    calculateDateRange();
  }, []);

  const calculateDateRange = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setMinDate(formatDate(nextDay));
    setMaxDate(formatDate(oneWeekLater));
    setAppointmentDate(formatDate(nextDay)); // Set default to next day
  };

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
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to send appointment request. Please try again.');
    }
  };

  return (
    <div className="appointments-box">
      <h2>Request Appointment</h2>
      <div className="appointment-group">
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
      <div className="appointment-group">
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
      <div className="appointment-group">
        <label>Appointment Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={minDate}
          max={maxDate}
        />
      </div>
      <button className="appointment-btn" onClick={handleBookAppointment}>Request Appointment</button>
    </div>
  );
};

export default Appointments;