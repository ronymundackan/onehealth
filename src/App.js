import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import MedicalRecords from './pages/MedicalRecords';
import Allergies from './pages/Allergies';
// import Appointments from './pages/Appointments';
// import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="allergies" element={<Allergies />} />
          {/* <Route path="appointments" element={<Appointments />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
        {/* Optional: Redirect to dashboard */}
        <Route path="*" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
