import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, MapPin, Users, Activity, Building, Settings, LogOut, X,
  Images,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define your menu items with paths
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'activities', label: 'All Activities', icon: Activity, path: '/allActivities' },
    { id: 'users', label: 'All Users', icon: Users, path: '/allUsers' },
    { id: 'places', label: 'All Places', icon: MapPin, path: '/allPlaces' },
    { id: 'service-providers', label: 'Transport Providers', icon: Building, path: '/serviceProviders' },
    { id: 'accommodation-providers', label: 'Accommodation Providers', icon: Building, path: '/accommodationProviders' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white z-30 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto w-70`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">HolidayNepal</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <li key={id}>
                  <button
                    onClick={() => {
                      navigate(path);
                      toggleSidebar();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              // Implement logout functionality here
              navigate('/logout');
              toggleSidebar();
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
