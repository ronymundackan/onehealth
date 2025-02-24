import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import MedicalRecords from './pages/MedicalRecords';
import Allergies from './pages/Allergies';
// import Appointments from './pages/Appointments';
// import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token'); // Or however you store your auth state

  if (!isAuthenticated) {
    // Redirect them to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="medical-records" />} /> {/* Default dashboard sub-route */}
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="allergies" element={<Allergies />} />
          {/* <Route path="appointments" element={<Appointments />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;