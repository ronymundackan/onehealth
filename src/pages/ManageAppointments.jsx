import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const appointmentSlots = [
    { id: 1, time: '8:00 AM - 9:00 AM' },
    { id: 2, time: '9:00 AM - 10:00 AM' },
    { id: 3, time: '10:00 AM - 11:00 AM' },
    { id: 4, time: '11:00 AM - 12:00 PM' },
    { id: 5, time: '1:00 PM - 2:00 PM' },
    { id: 6, time: '2:00 PM - 3:00 PM' },
    { id: 7, time: '3:00 PM - 4:00 PM' },
    { id: 8, time: '4:00 PM - 5:00 PM' },
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/appointments/${appointmentId}/approve`,
        { slot: selectedSlot },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAppointments();
      setSelectedSlot('');
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  return (
    <div>
      <h2>Manage Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Phone Number</th>
            <th>Appointment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.appointment_id}>
              <td>{appointment.user_name}</td>
              <td>{appointment.phone_number}</td>
              <td>{appointment.appointment_date}</td>
              <td>
                <select
                  value={selectedSlot}
                  onChange={handleSlotChange}
                  disabled={selectedAppointmentId !== appointment.appointment_id}
                >
                  <option value="">Select Slot</option>
                  {appointmentSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      Slot {slot.id} ({slot.time})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleApproveAppointment(appointment.appointment_id)}
                  disabled={!selectedSlot || selectedAppointmentId !== appointment.appointment_id}
                >
                  Approve
                </button>
                <button
                  onClick={() => setSelectedAppointmentId(appointment.appointment_id)}
                  disabled={selectedAppointmentId === appointment.appointment_id}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAppointments;