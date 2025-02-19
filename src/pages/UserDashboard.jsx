import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, CalendarCheck, Settings, UserCircle } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm flex flex-col p-4">
        <div className="flex items-center mb-8">
          <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10 rounded-full mr-3" />
          <h1 className="text-xl font-semibold text-blue-600">Logoipsum</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <Link to="/dashboard" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/students" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
            <Users className="w-5 h-5 mr-3" /> Students
          </Link>
          <Link to="/attendance" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
            <CalendarCheck className="w-5 h-5 mr-3" /> Attendance
          </Link>
          <Link to="/settings" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </Link>
        </nav>

        {/* Profile Section */}
        <div className="flex items-center mt-auto py-4 border-t">
          <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full mr-3">
            G
          </div>
          <div>
            <h2 className="text-sm font-medium">John Doe</h2>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Page Content</h1>
      </div>
    </div>
  );
}
