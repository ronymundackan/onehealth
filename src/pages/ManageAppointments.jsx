import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slotCount, setSlotCount] = useState({});

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

  const formatappDate = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const adjustedDate = new Date(date.getTime() - offset);
    return adjustedDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
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
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = async (e, appointmentId) => {
    const slotValue = e.target.value;

    setSelectedSlots(prev => ({
      ...prev,
      [appointmentId]: slotValue
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/appointments/${appointmentId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { doctor_id, appointment_date } = response.data;

      const appdate = formatappDate(appointment_date);
      fetchSlotCount(appdate, slotValue, doctor_id, appointmentId);

    } catch (error) {
      console.error("Error fetching appointment details:", error);
      setError("Failed to fetch appointment details.");
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const selectedSlot = selectedSlots[appointmentId];
      if (!selectedSlot) return;

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

      setSelectedSlots(prev => {
        const updated = { ...prev };
        delete updated[appointmentId];
        return updated;
      });

      setSlotCount(prev => {
        const updated = { ...prev };
        delete updated[appointmentId];
        return updated;
      });
    } catch (error) {
      console.error('Error approving appointment:', error);
      setError(error);
    }
  };

  const fetchSlotCount = async (appointmentDate, slot, doctorId, appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/appointments/slots/${appointmentDate}/${slot}/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSlotCount(prevCounts => ({
        ...prevCounts,
        [appointmentId]: response.data.count
      }));
    } catch (error) {
      console.error('Error fetching slot count:', error);
      setError(error);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error.message}</div>;
  }

  return (
    <div className="manage-appointments-container">
      <h2 className="page-title">Manage Appointments</h2>
      <div className="table-responsive">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Phone Number</th>
              <th>Appointment Date</th>
              <th>Doctor Name</th>
              <th>Total Appointments</th>
              <th>Slot Selection</th>
              <th>Booked Slots</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointment_id}>
                <td>{appointment.user_name}</td>
                <td>{appointment.phone_number}</td>
                <td>{formatDate(appointment.appointment_date)}</td>
                <td>{appointment.doctor_name}</td>
                <td className="text-center">{appointment.total_appointments}</td>
                <td className="slot-selection-cell">
                  <div className="slot-control-group">
                    <select
                      className="slot-select"
                      value={selectedSlots[appointment.appointment_id] || ""}
                      onChange={(e) => handleSlotChange(e, appointment.appointment_id)}
                    >
                      <option value="">Select Slot</option>
                      {appointmentSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          Slot {slot.id} ({slot.time})
                        </option>
                      ))}
                    </select>
                    <button
                      className="approve-button"
                      onClick={() => handleApproveAppointment(appointment.appointment_id)}
                      disabled={!selectedSlots[appointment.appointment_id]}
                    >
                      Approve
                    </button>
                  </div>
                </td>
                <td className="text-center booked-slots-cell">
                  {selectedSlots[appointment.appointment_id] &&
                    <span className="slot-count">
                      {slotCount[appointment.appointment_id] || 0}
                    </span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAppointments;