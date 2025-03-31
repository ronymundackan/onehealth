import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AppointmentStatus.css';

const SortAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('appointment_date');
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        appointmentId: null
    });

    useEffect(() => {
        fetchSortedAppointments();
    }, [statusFilter, sortBy]);

    const fetchSortedAppointments = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            
            let url = 'http://localhost:5000/appointments/sorted';
            const params = new URLSearchParams();
            
            if (sortBy) params.append('sortBy', sortBy);
            if (statusFilter) params.append('status', statusFilter);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setAppointments(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching sorted appointments:', error);
            setIsLoading(false);
        }
    };

    const handleMarkAsComplete = (appointmentId) => {
        setConfirmDialog({
            isOpen: true,
            appointmentId
        });
    };

    const confirmMarkAsComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/appointments/${confirmDialog.appointmentId}/complete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const updatedAppointments = appointments.map(appointment => 
                appointment.appointment_id === confirmDialog.appointmentId 
                    ? { ...appointment, status: 'completed' } 
                    : appointment
            );
            setAppointments(updatedAppointments);
            
            setConfirmDialog({ isOpen: false, appointmentId: null });
        } catch (error) {
            console.error('Error marking appointment as complete:', error);
            alert('Failed to mark appointment as complete. Please try again.');
        }
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ isOpen: false, appointmentId: null });
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
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
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

    return (
        <div className="appointments-container">
            <h2>Appointments</h2>
            
            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="statusFilter">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label htmlFor="sortBy">Sort by:</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="appointment_date">Date</option>
                        <option value="created_at">Created Time</option>
                        <option value="status">Status</option>
                    </select>
                </div>
            </div>

            <div className="appointments-section">
                <h3>Sorted Appointments</h3>
                {isLoading ? (
                    <div className="loading-message">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                    <div className="no-appointments-message">No appointments found. Try changing your filters.</div>
                ) : (
                    <div className="table-container">
                        <table className="appointments-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Phone Number</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    {appointments[0].access_status !== undefined && <th>Access</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.appointment_id}>
                                        <td>{appointment.patient_name || appointment.user_name}</td>
                                        <td>{appointment.phone_number}</td>
                                        <td>{appointment.doctor_name}</td>
                                        <td>{formatDate(appointment.appointment_date)}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{getSlotTime(appointment.slot)}</td>
                                        {appointment.access_status !== undefined && (
                                            <td>
                                                <span className={appointment.access_status ? 'access-granted' : 'access-revoked'}>
                                                    {appointment.access_status ? 'Granted' : 'Revoked'}
                                                </span>
                                            </td>
                                        )}
                                        <td>
                                            {appointment.status === 'approved' && (
                                                <button 
                                                    className="complete-button"
                                                    onClick={() => handleMarkAsComplete(appointment.appointment_id)}
                                                >
                                                    Mark as Complete
                                                </button>
                                            )}
                                            {appointment.status === 'completed' && (
                                                <span className="completed-action">
                                                    Completed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog as a Modal */}
            {confirmDialog.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Action</h3>
                        <p>Are you sure you want to mark this treatment as complete?</p>
                        <div className="modal-actions">
                            <button onClick={closeConfirmDialog} className="cancel-button">Cancel</button>
                            <button onClick={confirmMarkAsComplete} className="confirm-button">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortAppointments;