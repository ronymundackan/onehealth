import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Hand, 
  Settings, 
} from 'lucide-react';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Settings');
  
  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar - Fixed position */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-full fixed left-0 top-0">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-indigo-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="ml-2 text-xl font-semibold text-indigo-700">Logoipsum</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            text="Dashboard" 
            active={activeItem === 'Dashboard'} 
            onClick={() => setActiveItem('Dashboard')}
          />
          <NavItem 
            icon={<GraduationCap size={20} />} 
            text="Students" 
            active={activeItem === 'Students'} 
            onClick={() => setActiveItem('Students')}
          />
          <NavItem 
            icon={<Hand size={20} />} 
            text="Attendance" 
            active={activeItem === 'Attendance'} 
            onClick={() => setActiveItem('Attendance')}
          />
          <NavItem 
            icon={<Settings size={20} />} 
            text="Settings" 
            active={activeItem === 'Settings'} 
            onClick={() => setActiveItem('Settings')}
          />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-800 text-white">
              <span>G</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Game Play</p>
              <p className="text-xs text-gray-500">gameplayapp007@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - With left margin to account for sidebar */}
      <div className="ml-64 flex-1 p-6">
        <div className="text-lg font-medium">page</div>
        {/* Here you would add your main page content */}
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, text, active, onClick }) => {
  return (
    <div 
      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
        active 
          ? 'bg-indigo-600 text-white' 
          : 'text-gray-600 hover:bg-indigo-600 hover:text-white'
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

export default Dashboard;