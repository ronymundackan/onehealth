import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Calendar,
  Settings,
  User
} from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/server/api/userinfo.php', {
          method: 'GET',
          credentials: 'include', // Important for sending session cookies
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/medical-records')) return 'MedicalRecords';
    if (path.includes('/allergies')) return 'Allergies';
    if (path.includes('/appointments')) return 'Appointments';
    if (path.includes('/settings')) return 'Settings';
    return 'MedicalRecords'; // Default
  };

  const activeItem = getActiveItem();

  const handleNavigation = (route) => {
    navigate(`/user-dashboard/${route}`);
  };
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); //remove the user role as well.

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar - Fixed position */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-full fixed left-0 top-0">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="ml-2 text-xl font-semibold text-blue-700">MediCare</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-4">
          <NavItem
            icon={<FileText size={20} />}
            text="Medical Records"
            active={activeItem === 'MedicalRecords'}
            onClick={() => handleNavigation('medical-records')}
          />
          <NavItem
            icon={<AlertTriangle size={20} />}
            text="Allergies"
            active={activeItem === 'Allergies'}
            onClick={() => handleNavigation('allergies')}
          />
          <NavItem
            icon={<Calendar size={20} />}
            text="Book Appointments"
            active={activeItem === 'Appointments'}
            onClick={() => handleNavigation('appointments')}
          />
          <NavItem
            icon={<Settings size={20} />}
            text="Settings"
            active={activeItem === 'Settings'}
            onClick={() => handleNavigation('settings')}
          />
        </nav>

        {/* User Profile */}
        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 text-white">
              <User size={16} />
            </div>
            <div className="ml-3">
              {loading ? (
                <>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded mt-1 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-500">{userData?.full_name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500">{userData?.email || 'No email available'}</p>
                </>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>

      {/* Main Content - With left margin to account for sidebar */}
      <div className="ml-64 flex-1 p-6">
        {/* This is where the routed component will be rendered */}
        <Outlet />
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, text, active, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${active
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-blue-600 hover:text-white'
        }`}
      onClick={onClick}
    >
      <div>{icon}</div>
      <span className="ml-4 font-medium">{text}</span>
      {active && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;