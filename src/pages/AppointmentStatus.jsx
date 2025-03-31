import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AppointmentStatus.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [slot, setSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    if (userRole === 'hospital') {
      fetchHospitalAppointments();
    } else {
      fetchUserAppointments();
    }
  }, [userRole]);

  const fetchHospitalAppointments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/appointments/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserAppointments(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      setIsLoading(false);
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/appointments/${appointmentId}/approve`,
        { slot },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchHospitalAppointments();
      setSlot('');
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  const handleToggleAccess = async (appointmentId, currentAccessStatus) => {
    try {
      setIsLoading(true);

      // Optimistically update the UI
      setUserAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointment_id === appointmentId
            ? { ...appointment, access_status: !currentAccessStatus }
            : appointment
        )
      );

      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/appointments/${appointmentId}/access`,
        { accessStatus: !currentAccessStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.error('Error toggling access:', error);
      setIsLoading(false);
      fetchUserAppointments();
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed'
      default:
        return '';
    }
  };

  const getSlotTime = (slot) => {
    switch (parseInt(slot)) {
      case 1:
        return '8:00 AM - 9:00 AM';
      case 2:
        return '9:00 AM - 10:00 AM';
      case 3:
        return '10:00 AM - 11:00 AM';
      case 4:
        return '11:00 AM - 12:00 PM';
      case 5:
        return '1:00 PM - 2:00 PM';
      case 6:
        return '2:00 PM - 3:00 PM';
      case 7:
        return '3:00 PM - 4:00 PM';
      case 8:
        return '4:00 PM - 5:00 PM';
      default:
        return 'Not assigned';
    }
  };

  // Disable buttons during loading
  const isButtonDisabled = isLoading;

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>

      {userRole === 'hospital' ? (
        <div className="appointments-section">
          <h3>Pending Appointments</h3>
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Phone Number</th>
                  <th>Appointment Date</th>
                  <th>Time Slot</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>{appointment.user_name}</td>
                    <td>{appointment.phone_number}</td>
                    <td>{formatDate(appointment.appointment_date)}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter time slot"
                        onChange={(e) => setSlot(e.target.value)}
                        className="slot-input"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleApproveAppointment(appointment.appointment_id)}
                        className="approve-btn"
                        disabled={isButtonDisabled}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="appointments-section">
          <h3>Your Appointments</h3>
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {userAppointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>{appointment.hospital_name}</td>
                    <td>{appointment.doctor_name}</td>
                    <td>{formatDate(appointment.appointment_date)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td>{getSlotTime(appointment.slot)}</td>
                    <td>
                      <button
                        onClick={() => handleToggleAccess(appointment.appointment_id, appointment.access_status)}
                        style={{ backgroundColor: appointment.access_status ? 'red' : 'green', color: 'white' }}
                      >
                        {appointment.access_status ? 'Revoke' : 'Grant'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;