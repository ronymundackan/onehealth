import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MedicalRecords from './pages/MedicalRecords';
import Allergies from './pages/Allergies';
import Doctors from './pages/Doctors';
import SearchRecords from './pages/SearchRecords';
import ManageAppointments from './pages/ManageAppointments';
import AppointmentStatus from './pages/AppointmentStatus';
import SortAppointments from './pages/SortAppointments'; // Import SortAppointments
import ProtectedRoute from './components/ProtectedRoute';
import Appointments from './pages/Appointments';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="medical-records" />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="allergies" element={<Allergies />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointment-status" element={<AppointmentStatus />} />
        </Route>

        <Route
          path="/hospital-dashboard"
          element={
            <ProtectedRoute>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="doctors" />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="view-records" element={<SearchRecords />} />
          <Route path="manage-appointments" element={<ManageAppointments />} />
          <Route path="sort-appointments" element={<SortAppointments />} /> {/* Changed from settings */}
        </Route>

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
        </Route>

        <Route path="*" element={<Navigate to="/landing-page" />} />
      </Routes>
    </Router>
  );
}

export default App;